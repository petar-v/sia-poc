import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { wrapper } from "@/redux/store";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { Select, Button, Space, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { selectBackendState, setBackend } from "@/redux/store/backendSlice";
import {
    selectSoW,
    setStatementOfWork,
    selectProjectPlan,
    setProjectPlan,
    selectProjectStage,
    setAwaitingBackend,
    ProjectStage,
    selectIssue,
    setIssue,
} from "@/redux/store/projectSlice";

import Backend, { getBackend } from "@/llm-backend/backend";
import ProjectData, { Issue } from "@/projectData";

import Header from "@/components/header";
import SoWInput from "@/components/sowInput";
import ProjectPlan from "@/components/projectPlan";
import ProgressBar from "@/components/progressBar";
import IssueDisplay from "@/components/issueDisplay";

import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const AppBody = () => {
    const dispatch = useAppDispatch();

    const backend: Backend = useAppSelector(selectBackendState);
    const statementOfWork = useAppSelector(selectSoW);
    const projectPlan = useAppSelector(selectProjectPlan);
    const issue = useAppSelector(selectIssue);

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
                onIssue: function (issue: Issue): void {
                    dispatch(setIssue(issue));
                },
            };
            return getBackend(backend)(call);
        },
        [backend, dispatch],
    );

    const onSubmit = (sow: string) => {
        dispatch(setStatementOfWork(sow));
        dispatch(setAwaitingBackend(true));
        window.scrollTo(0, 0);
        submitPrompt(sow, (incompleteProjectData: ProjectData) => {
            dispatch(setProjectPlan({ ...incompleteProjectData }));
        }).then((resp) => {
            dispatch(setAwaitingBackend(false));
            if (resp) {
                console.log("incomplete data", resp);
                dispatch(setProjectPlan({ ...resp }));
            }
            // TODO: handle edge case
        });
    };

    const view = () => {
        if (issue) {
            return <IssueDisplay {...issue} />;
        }

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
            <ProgressBar stage={projectStage} />
            {view()}
        </>
    );
};

// TODO: think about persisting the state between pages: https://blog.logrocket.com/use-redux-next-js/

const defaultBackend = "openai";

const App = () => {
    const backend = useAppSelector(selectBackendState);
    const dispatch = useAppDispatch();

    const options = [
        { value: "openai", label: "ChatGPT 3.5 Turbo" },
        { value: "dummy", label: "Dummy offline data" },
    ];

    useEffect(() => {
        // switch to openAI backend by default
        dispatch(setBackend(defaultBackend));
    }, [dispatch]);

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
                            console.log("Backend set to", value);
                            dispatch(setBackend(value));
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

const SocketApp = () => {
    const [input, setInput] = useState("");

    let socket: Socket | null = null;

    const socketInitializer = async () => {
        fetch("/api/socket");
        socket = io();

        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on("update-input", (msg) => {
            setInput(msg);
        });
    };

    useEffect(() => {
        socketInitializer();
    });

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (socket !== null) {
            socket.emit("input-change", e.target.value);
        }
    };
    return (
        <main>
            <input
                placeholder="Type something"
                value={input}
                onChange={onChangeHandler}
            />
        </main>
    );
};

const WrappedApp = (appProps: {}) => {
    const { store, props } = wrapper.useWrappedStore(appProps);
    return (
        <Provider store={store}>
            <SocketApp {...props} />
        </Provider>
    );
};

export default WrappedApp;
