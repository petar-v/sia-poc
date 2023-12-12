import type { Server as HTTPServer } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer, Socket } from "socket.io";
import { Server } from "socket.io";

import { SessionData } from "@/lib/session";
import createChatSession, { ChatSession } from "@/llm-backend/openai";

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
    server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
}

const openAIkey = process.env.OPENAI_API_KEY || "";
const openAIorg = process.env.OPENAI_ORG_ID || "";

// TODO: this whole thing should get migrated to NestJS or something else. Next.js is unable to do the backend session handling I need.

const getSessionData = (socket: Socket) => socket.handshake.auth as SessionData;

const chatSessions: { [key: string]: ChatSession } = {};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    // TODO: recreate the server in dev env
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

    io.on("connection", (socket) => {
        // here be custom session syncing between next.js and socket.io
        const session = getSessionData(socket);
        const sessionID = session.id;

        console.log("New Connection with session", sessionID);
        socket.join(sessionID);

        if (chatSessions[sessionID] === undefined) {
            chatSessions[sessionID] = createChatSession(openAIkey, openAIorg);
        }
        const chatSession = chatSessions[sessionID];
        // TODO: add constants for the events
        socket.on("prompt", async (message) => {
            const stream = await chatSession.prompt(message);
            const reader = stream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                socket.emit("reply", value);
            }
        });
        socket.on("sow", async (sow) => {
            const stream = await chatSession.statementOfWorkToProjectPlan(sow);
            const reader = stream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                console.log("EMISSION", value, done);
                console.log("");
                if (done) {
                    break;
                }
                socket.emit("project-plan", value);
            }
        });
        // TODO: kill the chatgpt session once the user destroys the session.
    });

    res.end();
};

export default SocketHandler;
