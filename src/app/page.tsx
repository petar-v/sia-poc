import Header from "./components/header";
import App from "../sia/App";

export default function Home() {
    const apiKey = process.env.OPENAI_API_KEY || "";
    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center p-24">
                <App ApiKey={apiKey}></App>
            </main>
        </>
    );
}
