import React, { useState } from "react";
import ProjectData from "@/lib/projectData";

import { Card, Space, Descriptions, Modal, Skeleton, Typography } from "antd";
import type { DescriptionsProps } from "antd";

export type ProjectPlanProps = {
    data: ProjectData;
    loading: boolean;
};

const descriptionPropsFromProjectPlan = (data: ProjectData) => {
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
    return items;
};

// TODO: this needs to be it's own page
export default function ProjectPlan({ data, loading }: ProjectPlanProps) {
    const [taskOpen, setTaskOpen] = useState(-1);

    const items = descriptionPropsFromProjectPlan(data);
    const modalHandleClose = () => {
        setTaskOpen(-1);
    };
    return (
        <>
            <div className="mb-3">
                {data.info && (
                    <Descriptions title="Project Details" items={items} />
                )}
                {!data.info && (
                    <Skeleton active round paragraph loading={loading} />
                )}
            </div>
            <>
                <Typography.Title level={5}>Project Breakdown</Typography.Title>
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
                    {loading && (
                        <Card
                            key={`dummy-loading`}
                            style={{ width: 300 }}
                            loading={true}
                        >
                            <Card.Meta
                                title="Card title"
                                description="This is the description"
                            />
                        </Card>
                    )}
                </Space>
            </>
        </>
    );
}
