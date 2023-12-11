import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
    selectSoW,
    selectProjectPlan,
    selectProjectStage,
    ProjectStage,
    selectIssue,
    setSoW,
} from "@/redux/store/projectSlice";

import SoWInput from "@/components/sowInput";
import ProjectPlan from "@/components/projectPlan";
import ProgressBar from "@/components/progressBar";
import IssueDisplay from "@/components/issueDisplay";
import { Spin } from "antd";

const Wizard = () => {
    const dispatch = useAppDispatch();

    const statementOfWork = useAppSelector(selectSoW);
    const projectPlan = useAppSelector(selectProjectPlan);
    const issue = useAppSelector(selectIssue);

    const projectStage = useAppSelector(selectProjectStage);

    const onSubmit = (sow: string) => {
        dispatch(setSoW(sow));
        window.scrollTo(0, 0);
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
