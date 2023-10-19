import React, { useState } from "react";
import ProjectData from "../projectData";

import { Card, Space, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

export type ProjectPlanProps = {
    data: ProjectData;
};

export default function ProjectPlan({ data }: ProjectPlanProps) {
    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Total Time Estimate",
            children: data.timeEst,
        },
        {
            key: "2",
            label: "Cost estimate",
            children: data.totalCost,
        },
        {
            key: "3",
            label: "Number of Engineres required",
            children: data.numberOfEngineers,
        },
    ];
    return (
        <>
            <h2>Project Plan</h2>
            <h5>Estimate: {data.timeEst} days</h5>
            <Descriptions title="Project Details" items={items} />;
            <Space className="flex flex-wrap">
                {data.tasks.map((task, i) => (
                    <Card
                        key={`task-${i}`}
                        title={task.title}
                        extra={<small>{task.timeEst} days</small>}
                        style={{ width: 300 }}
                    >
                        <p>{task.description}</p>
                    </Card>
                ))}
            </Space>
        </>
    );
}
