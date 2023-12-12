import { io } from "socket.io-client";

export const createSocket = () =>
    io({
        withCredentials: true,
        autoConnect: false,
    });

// TODO: this is not a good practice and will be removed.
// This method pings the socket endpoint that bootstraps
// the websocket.
export const bumpServer = async () => await fetch("/api/socket");

export type SocketType = ReturnType<typeof createSocket>;
