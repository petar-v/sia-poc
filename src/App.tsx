import React, { useState, useCallback } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import { wrapper } from "./redux/store";

import { Select, Button, Space, Spin, Steps } from "antd";
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    RobotOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

import Header from "./components/header";

import { selectBackendState, setBackend } from "./redux/store/backendSlice";
import Backend, {
    getBackend,
    DummyBackend,
    OpenAIBackend,
} from "./llm-backend/backend";

import SoWInput from "./components/sowInput";
import ProjectPlan from "./components/projectPlan";

import ProjectData from "./projectData";

const AppBody = () => {
    const backend: Backend = useSelector(selectBackendState);
    const [sow, setSow] = useState("");
    const [resp, setResp] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(false);

    const submitPrompt = useCallback(
        async (
            sow: string,
            onPartialResponse: (response: ProjectData) => void,
        ): Promise<ProjectData | null> => {
            const call = {
                prompt: sow,
                onDataChunk: onPartialResponse,
                onFinish: function (projectData: ProjectData): void {
                    console.log("finished project data", projectData);
                },
            };
            return getBackend(backend)(call);
        },
        [backend],
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
                <div className="mt-5">
                    <Spin tip="Loading information..." size="large">
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
        </>
    );
};

// TODO: think about persisting the state: https://blog.logrocket.com/use-redux-next-js/

const App = (appProps: {}) => {
    const { store, props } = wrapper.useWrappedStore(appProps);

    const backend = useSelector(selectBackendState);
    const dispatch = useDispatch();

    const options = [
        { value: "openai", label: "ChatGPT 3.5 Turbo" },
        { value: "dummy", label: "Dummy offline data" },
    ];

    const configs: {
        openai: OpenAIBackend;
        dummy: DummyBackend;
    } = {
        openai: {
            name: "openai",
            // FIXME: keys not visible
            apiKey: process.env.OPENAI_API_KEY || "",
            orgKey: process.env.OPENAI_ORG_ID || "",
        },
        dummy: {
            name: "dummy",
        },
    };

    return (
        <Provider store={store}>
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
                        defaultValue={backend.name}
                        options={options}
                        onChange={(value: "openai" | "dummy") => {
                            console.log("Backend set to", configs[value]);
                            dispatch(setBackend(configs[value]));
                        }}
                    />
                </Space>
            </Header>
            <main className="flex flex-col p-16">
                <AppBody />
            </main>
        </Provider>
    );
};

export default App;
