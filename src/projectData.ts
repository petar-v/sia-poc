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

type ProjectData = {
    tasks: Task[];
    info?: ProjectInfo;
};

export default ProjectData;
