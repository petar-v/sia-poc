"use client";
import React, { useState, useCallback } from "react";

import { Spin, Steps } from "antd";
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

export default function App({ ApiKey, backend }: AppProps) {
    const [sow, setSow] = useState("");
    const [resp, setResp] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(false);

    const submitPrompt = useCallback(
        async (
            sow: string,
            onPartialResponse: (response: ProjectData) => void,
        ): Promise<ProjectData | null> => {
            if (backend === "chatgpt")
                return await prompt(ApiKey, {
                    prompt: sow,
                    onDataChunk: onPartialResponse,
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
        setLoading(true);
        window.scrollTo(0, 0);
        submitPrompt(sow, (incompleteProjectData: ProjectData) => {
            console.log("incomplete data", incompleteProjectData);
            setResp({ ...incompleteProjectData });
        }).then((resp) => {
            if (resp) {
                setResp({ ...resp });
                setLoading(false);
            }
        });
    };

    const view = () => {
        if (resp) {
            return <ProjectPlan data={resp} loading={loading} />;
        }

        if (sow) {
            return (
                <div className="">
                    <Spin tip="Processing" size="large">
                        <div className="content" />
                    </Spin>
                </div>
            );
        }

        return (
            <>
                <SoWInput onSubmit={onSubmit} />
            </>
        );
    };

    return (
        <div className="flex flex-col p-20">
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
                            if (resp && !loading) {
                                return "finish";
                            }
                            if (sow) {
                                return "process";
                            }
                            return "wait";
                        })(),
                        icon: loading ? <LoadingOutlined /> : <RobotOutlined />,
                    },
                    {
                        title: "Project plan",
                        status: resp && sow && !loading ? "finish" : "wait",
                        icon: <SmileOutlined />,
                    },
                ]}
            />
            {view()}
        </div>
    );
}
