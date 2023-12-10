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
    const [reply, setReply] = useState("");

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
            setReply(`Socket error ${e.message}`);
        });

        socket.on("bot-reply", (msg) => {
            console.log("Received", msg);
            setReply(msg);
        });

        return socket;
    }, []);

    useEffect(() => {
        socketInitializer().then((s) => (socket = s));
    }, [socketInitializer]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };
    const onSubmit = () => {
        if (socket !== null) {
            socket.emit("prompt", input);
        }
    };
    return (
        <main>
            <p>Initial session: {session.id}</p>
            <input placeholder="Ask something" onChange={onChangeHandler} />
            <button onClick={onSubmit}>Submit</button>
            <p>{reply}</p>
        </main>
    );
}
