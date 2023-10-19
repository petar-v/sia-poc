"use client"; // FIXME: find a way not to have to wrap this in a client component

import React, { useState } from "react";

import { Select } from "antd";

import Header from "./components/header";
import App from "../sia/App";

export type AppWrapperProps = {
    ApiKey: string;
};

export default function AppWrapper({ ApiKey }: AppWrapperProps) {
    const [backend, setBackend] = useState<"dummy" | "chatgpt">("dummy");
    return (
        <>
            <Header>
                <Select
                    defaultValue={backend}
                    options={[
                        { value: "dummy", label: "Dummy offline data" },
                        { value: "chatgpt", label: "ChatGPT 3.5 Turbo" },
                    ]}
                    onChange={(value) => {
                        console.log("Backend set to", value);
                        setBackend(value);
                    }}
                />
            </Header>
            <main className="flex min-h-screen flex-col items-center p-24">
                <App ApiKey={ApiKey} backend={backend}></App>
            </main>
        </>
    );
}
