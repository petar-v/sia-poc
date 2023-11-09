import { Steps } from "antd";
import {
    LoadingOutlined,
    SmileOutlined,
    SolutionOutlined,
    RobotOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";

import { ProjectStage } from "@/redux/store/projectSlice";

export type ProgressBarProps = {
    stage: ProjectStage;
};

const ProgressBar = ({ stage }: ProgressBarProps) => {
    const isDone = [ProjectStage.COMPLETED, ProjectStage.ISSUES].includes(
        stage,
    );
    return (
        <Steps
            className="mb-5"
            items={[
                {
                    title: "Statement of Work",
                    status:
                        stage === ProjectStage.INITIAL ? "process" : "finish",
                    icon: <SolutionOutlined />,
                },
                {
                    title: "Processing",
                    status: (() => {
                        if (isDone) {
                            return "finish";
                        }
                        if (stage === ProjectStage.PROCESSING) {
                            return "process";
                        }
                        return "wait";
                    })(),
                    icon:
                        stage === ProjectStage.PROCESSING ? (
                            <LoadingOutlined />
                        ) : (
                            <RobotOutlined />
                        ),
                },
                {
                    title: "Project plan",
                    status: isDone ? "finish" : "wait",
                    icon:
                        stage === ProjectStage.ISSUES ? (
                            <QuestionCircleOutlined />
                        ) : (
                            <SmileOutlined />
                        ),
                },
            ]}
        />
    );
};

export default ProgressBar;
