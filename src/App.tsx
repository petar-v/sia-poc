import React, { useState, useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import { wrapper } from "./redux/store";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

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
import { selectSoW, setStatementOfWork } from "./redux/store/projectSlice";

import Backend, {
    getBackend,
    DummyBackend,
    OpenAIBackend,
} from "./llm-backend/backend";

import SoWInput from "./components/sowInput";
import ProjectPlan from "./components/projectPlan";

import ProjectData from "./projectData";

const AppBody = () => {
    const dispatch = useAppDispatch();

    const backend: Backend = useAppSelector(selectBackendState);
    const statementOfWork = useAppSelector(selectSoW);

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
        dispatch(setStatementOfWork(sow));
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

        if (statementOfWork) {
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
                        status:
                            !resp && !statementOfWork ? "process" : "finish",
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: "Processing",
                        status: (() => {
                            if (resp && !loading) {
                                return "finish";
                            }
                            if (statementOfWork) {
                                return "process";
                            }
                            return "wait";
                        })(),
                        icon: loading ? <LoadingOutlined /> : <RobotOutlined />,
                    },
                    {
                        title: "Project plan",
                        status:
                            resp && statementOfWork && !loading
                                ? "finish"
                                : "wait",
                        icon: <SmileOutlined />,
                    },
                ]}
            />
            {view()}
        </>
    );
};

// TODO: think about persisting the state between pages: https://blog.logrocket.com/use-redux-next-js/

export type AppProps = {
    openai: OpenAIBackend;
    dummy: DummyBackend;
};

const App = (props: AppProps) => {
    const backend = useAppSelector(selectBackendState);
    const dispatch = useAppDispatch();

    const options = [
        { value: "openai", label: "ChatGPT 3.5 Turbo" },
        { value: "dummy", label: "Dummy offline data" },
    ];

    useEffect(() => {
        // switch to openAI backend by default
        dispatch(setBackend(props.openai));
    }, [dispatch, props.openai]);

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
                        defaultValue={backend.name}
                        value={backend.name}
                        onChange={(value: "openai" | "dummy") => {
                            console.log("Backend set to", props[value]);
                            dispatch(setBackend(props[value]));
                        }}
                    />
                </Space>
            </Header>
            <main className="flex flex-col p-16">
                <AppBody />
            </main>
        </>
    );
};

const WrappedApp = (appProps: AppProps) => {
    const { store, props } = wrapper.useWrappedStore(appProps);
    return (
        <Provider store={store}>
            <App {...props} />
        </Provider>
    );
};

export default WrappedApp;
