"use client"; // FIXME: find a way not to have to wrap this in a client component

import React, { useState } from "react";

import { Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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
                <Space wrap>
                    <Button
                        type="dashed"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            location.reload();
                        }}
                    >
                        Reload
                    </Button>
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
                </Space>
            </Header>
            <main className="flex min-h-screen flex-col items-center p-24">
                <App ApiKey={ApiKey} backend={backend}></App>
            </main>
        </>
    );
}