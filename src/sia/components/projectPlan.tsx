import React, { useState } from "react";
import ProjectData from "../projectData";

export type ProjectPlanProps = {
    data: ProjectData;
};

export default function ProjectPlan({ data }: ProjectPlanProps) {
    return (
        <>
            <h2>Project Plan</h2>
            <h5>Estimate: {data.timeEst} days</h5>
            <ul>
                {data.tasks.map((task, i) => (
                    <li key={`task-${i}`}>
                        <strong>{task.title}</strong>{" "}
                        <small>{task.timeEst} days</small>
                        <p>{task.description}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}
