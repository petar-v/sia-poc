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
    const [backend, setBackend] = useState<"dummy" | "chatgpt">("chatgpt");
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
                            { value: "chatgpt", label: "ChatGPT 3.5 Turbo" },
                            { value: "dummy", label: "Dummy offline data" },
                        ]}
                        onChange={(value) => {
                            console.log("Backend set to", value);
                            setBackend(value);
                        }}
                    />
                </Space>
            </Header>
            <main>
                <App ApiKey={ApiKey} backend={backend}></App>
            </main>
        </>
    );
}
