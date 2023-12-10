import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer, Socket } from "socket.io";
import { Server } from "socket.io";

import { SessionData } from "@/lib/session";

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

// TODO: this whole thing should get migrated to NestJS or something else. Next.js is unable to do the backend session handling I need.

const getSessionData = (socket: Socket) => socket.handshake.auth as SessionData;

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (res.socket.server.io) {
        console.log("Socket is already running.");
        res.end();
        return;
    }

    console.log("Socket is initializing...");

    const io = new Server(res.socket.server, {
        cors: {
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const session = getSessionData(socket);
        if (!session.id) {
            return next(new Error("Session ID is not set!"));
        }
        next();
    });

    res.socket.server.io = io;

    io.on("connection", async (socket) => {
        // here be custom session syncing between next.js and socket.io
        const session = getSessionData(socket);
        console.log("New Connection with session", session.id);
        socket.join(session.id);

        socket.on("input-change", (msg) => {
            console.log("message", msg);
            socket.emit("update-input", `${msg}, session: ${session.id}`);
        });
    });

    res.end();
};

export default SocketHandler;
