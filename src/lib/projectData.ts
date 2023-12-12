// Note: remember to update the bot prompts if this changes
export type Task = {
    title: string;
    desc: string;
    timeEst: number;
    details: string;
};

export type ProjectInfo = {
    timeEst: number;
    totalCost: number;
    numberOfEngineers: number;
    risks: string;
};

export type Issue = {
    mainIssue: string;
    feedback: string;
    thingsToFix: string[];
};

type ProjectData = {
    tasks: Task[];
    info?: ProjectInfo;
};

// FIXME: import this as a string to the model prompt

export default ProjectData;
