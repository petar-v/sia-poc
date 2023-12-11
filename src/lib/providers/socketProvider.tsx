import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { SessionData } from "@/lib/session";

const socket = io({
    withCredentials: true,
    autoConnect: false,
});
const SocketContext = createContext<Socket>(socket);

const SocketProvider = ({
    children,
    session,
}: {
    children: any;
    session: SessionData;
}) => {
    const [socketUp, setSocketUp] = useState(false);
    useEffect(() => {
        if (socketUp) {
            return;
        }
        console.log("Poking socket");
        fetch("/api/socket").then(() => {
            setSocketUp(true);
        });
    }, [socketUp]);

    useEffect(() => {
        if (!socketUp) {
            return;
        }

        socket.auth = session;
        socket.on("connect", () => {
            console.log("connected to ws", session.id);
        });

        socket.connect();
        return () => {
            socket?.disconnect();
        };
    }, [session, socketUp]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
