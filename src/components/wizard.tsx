import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
    selectSoW,
    selectProjectPlan,
    selectProjectStage,
    ProjectStage,
    selectIssue,
    setStatementOfWork,
} from "@/redux/store/projectSlice";

import SoWInput from "@/components/sowInput";
import ProjectPlan from "@/components/planner/projectPlan";
import ProgressBar from "@/components/elements/progressBar";
import IssueDisplay from "@/components/elements/issueDisplay";
import { Divider, Spin } from "antd";
import Chat from "./chat/chat";

const Wizard = () => {
    const dispatch = useAppDispatch();

    const statementOfWork = useAppSelector(selectSoW);
    const projectPlan = useAppSelector(selectProjectPlan);
    const issue = useAppSelector(selectIssue);

    const projectStage = useAppSelector(selectProjectStage);

    const onSubmit = (sow: string) => {
        dispatch(setStatementOfWork(sow)).then(() => {
            window.scrollTo(0, 0);
        });
    };

    const view = () => {
        if (issue) {
            return <IssueDisplay {...issue} />;
        }

        if (projectPlan) {
            // TODO: make this responsive
            return (
                <>
                    <ProjectPlan
                        data={projectPlan}
                        loading={projectStage === ProjectStage.PROCESSING}
                    />
                    {/* <Divider orientation="left">Ask SIA</Divider>
                    <Chat disabled={projectStage === ProjectStage.PROCESSING} /> */}
                </>
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
