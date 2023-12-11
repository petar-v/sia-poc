import React from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { selectBackendState, setBackend } from "@/redux/store/backendSlice";

import Header from "@/components/header";
import Wizard from "@/components/wizard";

import { DEFAULT_BACKEND, options } from "@/llm-backend/backend";

const App = () => {
    const backend = useAppSelector(selectBackendState);
    const dispatch = useAppDispatch();
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
                        options={options}
                        defaultValue={DEFAULT_BACKEND}
                        value={backend}
                        onChange={(value: "openai" | "dummy") => {
                            console.log("Backend set to", value);
                            dispatch(setBackend(value));
                        }}
                    />
                </Space>
            </Header>
            <main className="flex flex-col p-16">
                <Wizard />
            </main>
        </>
    );
};

export default App;
