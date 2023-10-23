"use client";
import React, { useState, useCallback } from "react";

import { Spin, Steps, Card } from "antd";
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    RobotOutlined,
} from "@ant-design/icons";

import SoWInput from "./components/sowInput";
import ProjectPlan from "./components/projectPlan";

import { prompt, promptDummy } from "./llm-backend/chatgpt";
import ProjectData from "./projectData";

export type AppProps = {
    ApiKey: string;
    backend: "chatgpt" | "dummy";
};

const DUMMY_CARDS = 7;

export default function App({ ApiKey, backend }: AppProps) {
    const [sow, setSow] = useState("");
    const [resp, setResp] = useState<ProjectData | null>(null);

    const submitPrompt = useCallback(
        async (sow: string): Promise<ProjectData | null> => {
            if (backend === "chatgpt")
                return await prompt(ApiKey, {
                    prompt: sow,
                    onDataChunk: (c) => console.log("parsed chunk", c),
                    onFinish: function (projectData: ProjectData): void {
                        console.log("finished project data", projectData);
                    },
                });
            else
                return await promptDummy({
                    prompt: sow,
                });
        },
        [ApiKey, backend],
    );

    const onSubmit = (sow: string) => {
        setSow(sow);
        window.scrollTo(0, 0);
        submitPrompt(sow).then((resp) => {
            if (resp) {
                setResp(resp);
            }
            // TODO: some retry logic
        });
    };

    const view = () => {
        if (resp) {
            return <ProjectPlan data={resp} />;
        }

        if (sow) {
            return (
                <>
                    <div className="flex flex-wrap">
                        {[...Array(DUMMY_CARDS).keys()].map((i) => (
                            <Card
                                key={`dummy-${i}`}
                                style={{ width: 300 }}
                                loading={true}
                            >
                                <Card.Meta
                                    title="Card title"
                                    description="This is the description"
                                />
                            </Card>
                        ))}
                    </div>
                    <Spin size="large"></Spin>
                    <span>Processing</span>
                </>
            );
        }

        return (
            <>
                <SoWInput onSubmit={onSubmit} />
            </>
        );
    };

    return (
        <>
            <Steps
                className="mb-5"
                items={[
                    {
                        title: "Statement of Work",
                        status: !resp && !sow ? "process" : "finish",
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: "Processing",
                        status: (() => {
                            if (resp) {
                                return "finish";
                            }
                            if (sow) {
                                return "process";
                            }
                            return "wait";
                        })(),
                        icon:
                            !resp && sow ? (
                                <LoadingOutlined />
                            ) : (
                                <RobotOutlined />
                            ),
                    },
                    {
                        title: "Project plan",
                        status: resp && sow ? "finish" : "wait",
                        icon: <SmileOutlined />,
                    },
                ]}
            />
            {view()}
        </>
    );
}
