import App from "@/App";

import type { InferGetStaticPropsType, GetStaticProps } from "next";

// FIXME: this exposes the keys to the frontend!
// There should be a backend for the chatgpt calls.
// Look into Cloudflare functions for that.

const openAIkey = process.env.OPENAI_API_KEY || "";
const openAIorg = process.env.OPENAI_ORG_ID || "";

export const getStaticProps = (async (context) => {
    return { props: { openAIkey, openAIorg } };
}) satisfies GetStaticProps<{
    openAIkey: string;
    openAIorg: string;
}>;

export default function Home(
    props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    // TODO: add next/Suspenses to the app
    return (
        <App
            dummy={{ name: "dummy" }}
            openai={{
                name: "openai",
                apiKey: props.openAIkey,
                orgKey: props.openAIorg,
            }}
        ></App>
    );
}
