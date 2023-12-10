// import App from "@/App";
import { useEffect, useState, useCallback, ChangeEvent } from "react";
// TODO: use react-use-websocket

import { v4 as uuidv4 } from "uuid";
import type { InferGetStaticPropsType } from "next";

import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import type { GetServerSideProps } from "next";

import io from "socket.io-client";
import type { Socket } from "socket.io-client";

// TODO: Extract this to a middleware
export const getServerSideProps = (async (context) => {
    const session = await getIronSession<SessionData>(
        context.req,
        context.res,
        sessionOptions,
    );

    if (!session.id) {
        // TODO: create a login page with some context or whatever
        // Currently, I'm just generating a session ID for each new session.
        session.id = uuidv4();
        await session.save();
    }

    return { props: { session } };
}) satisfies GetServerSideProps<{
    session: SessionData;
}>;

let socket: Socket | null = null;

// TODO: add next/Suspenses to the app
export default function SocketHome({
    session,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
    const [input, setInput] = useState("");

    const socketInitializer = useCallback(async () => {
        await fetch("/api/socket"); // bootstrap the socket

        const socket = io({
            withCredentials: true,
            auth: (cb) => {
                cb(session); // send the current session to the websocket server initially once.
            },
        });

        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on("connect_error", (e) => {
            console.error("socket error", e);
            setInput(`Socket error ${e.message}`);
        });

        socket.on("update-input", (msg) => {
            console.log("Received", msg);
            setInput(msg);
        });

        return socket;
    }, []);

    useEffect(() => {
        socketInitializer().then((s) => (socket = s));
    }, [socketInitializer]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("On change", e.target.value);
        if (socket !== null) {
            socket.emit("input-change", e.target.value);
        }
    };
    return (
        <main>
            <p>Initial session: {session.id}</p>
            <input placeholder="Type something" onChange={onChangeHandler} />
            <p>{input}</p>
        </main>
    );
}
