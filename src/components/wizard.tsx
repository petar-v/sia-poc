import React, { useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

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
import ProjectData, { Issue } from "@/lib/projectData";

import SoWInput from "@/components/sowInput";
import ProjectPlan from "@/components/projectPlan";
import ProgressBar from "@/components/progressBar";
import IssueDisplay from "@/components/issueDisplay";
import { selectBackendState } from "@/redux/store/backendSlice";
import { Spin } from "antd";
import { SocketContext } from "@/lib/providers/socketProvider";

const Wizard = () => {
    const dispatch = useAppDispatch();

    const backend: Backend = useAppSelector(selectBackendState);
    const statementOfWork = useAppSelector(selectSoW);
    const projectPlan = useAppSelector(selectProjectPlan);
    const issue = useAppSelector(selectIssue);

    const projectStage = useAppSelector(selectProjectStage);

    const socket = useContext(SocketContext);

    // TODO: how to submit prompt?
    //  - create Sow Action and put into state.
    //  - async action to post to websocket and get a reply
    //  - fill out the replied data to state via actions

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

export default Wizard;
