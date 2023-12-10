import App from "@/App";

import { v4 as uuidv4 } from "uuid";
import type { InferGetStaticPropsType, GetStaticProps } from "next";

import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import type { GetServerSideProps } from "next";

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
    }

    return { props: { session } };
}) satisfies GetServerSideProps<{
    session: SessionData;
}>;

export default function Home({
    session,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
    // TODO: add next/Suspenses to the app
    return <App />;
}
