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
import {
    selectSoW,
    setStatementOfWork,
    selectProjectPlan,
    setProjectPlan,
    selectProjectStage,
    setAwaitingBackend,
    ProjectStage,
} from "./redux/store/projectSlice";

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
    const projectPlan = useAppSelector(selectProjectPlan);

    const projectStage = useAppSelector(selectProjectStage);

    // FIXME: move this to Redux
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
        dispatch(setAwaitingBackend(true));
        window.scrollTo(0, 0);
        submitPrompt(sow, (incompleteProjectData: ProjectData) => {
            dispatch(setProjectPlan({ ...incompleteProjectData }));
        }).then((resp) => {
            if (resp) {
                console.log("incomplete data", resp);
                dispatch(setProjectPlan({ ...resp }));
                dispatch(setAwaitingBackend(false));
            }
            // TODO: handle edge case
        });
    };

    const view = () => {
        if (projectPlan) {
            return (
                <ProjectPlan
                    data={projectPlan}
                    loading={projectStage === ProjectStage.PROCESSING}
                />
            );
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
                            projectStage === ProjectStage.INITIAL
                                ? "process"
                                : "finish",
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: "Processing",
                        status: (() => {
                            if (projectStage === ProjectStage.COMPLETED) {
                                return "finish";
                            }
                            if (projectStage === ProjectStage.PROCESSING) {
                                return "process";
                            }
                            return "wait";
                        })(),
                        icon:
                            projectStage === ProjectStage.PROCESSING ? (
                                <LoadingOutlined />
                            ) : (
                                <RobotOutlined />
                            ),
                    },
                    {
                        title: "Project plan",
                        status:
                            projectStage === ProjectStage.COMPLETED
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
