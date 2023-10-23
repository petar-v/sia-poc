import React, { useState } from "react";
import ProjectData from "../projectData";

import { Card, Space, Descriptions, Modal } from "antd";
import type { DescriptionsProps } from "antd";

export type ProjectPlanProps = {
    data: ProjectData;
};

export default function ProjectPlan({ data }: ProjectPlanProps) {
    const [taskOpen, setTaskOpen] = useState(-1);

    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Total Time Estimate",
            children: data.info?.timeEst + " days",
        },
        {
            key: "2",
            label: "Cost estimate",
            children: data.info?.totalCost + "GBP",
        },
        {
            key: "3",
            label: "Number of Engineers required",
            children: data.info?.numberOfEngineers,
        },
        {
            key: "4",
            label: "Risks",
            children: data.info?.risks,
        },
    ];
    const modalHandleClose = () => {
        setTaskOpen(-1);
    };
    return (
        <>
            <Descriptions title="Project Details" items={items} />
            <Space className="flex flex-wrap">
                {data.tasks.map((task, i) => (
                    <div key={`taskC-${i}`}>
                        <Card
                            hoverable
                            key={`task-${i}`}
                            title={task.title}
                            extra={<small>{task.timeEst} days</small>}
                            style={{ width: 300 }}
                            onClick={() => setTaskOpen(i)}
                        >
                            <p>{task.desc}</p>
                        </Card>
                        <Modal
                            key={`modal-${i}`}
                            title={task.title}
                            footer={null}
                            open={taskOpen === i}
                            onOk={modalHandleClose}
                            onCancel={modalHandleClose}
                        >
                            {task.details.split("\n").map((p, i) => (
                                <p key={`p-${i}`}>{p}</p>
                            ))}
                        </Modal>
                    </div>
                ))}
            </Space>
        </>
    );
}
