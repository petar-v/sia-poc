import App from "@/App";

import type { InferGetStaticPropsType, GetStaticProps } from "next";

export const getStaticProps = (async (context) => {
    return { props: {} };
}) satisfies GetStaticProps<{}>;

export default function Home(
    props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    // TODO: add next/Suspenses to the app
    return <App />;
}
