import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";

import { SessionData } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";

const socket = io({
    withCredentials: true,
    auth: (cb) => {
        // create the session for the first time on socket connection.
        // TODO: find a better place for this
        // FIXME: create a new session
        const session: SessionData = {
            id: uuidv4(),
        };

        cb(session); // send the current session to the websocket server initially once.
    },
});

socket.on("connect", () => {
    console.log("connected");
});

const SocketContext = createContext<Socket>(socket);

const SocketProvider = ({ children }: any) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
