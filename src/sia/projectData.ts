type Task = {
    title: string;
    desc: string;
    timeEst: number;
    details: string;
};

type ProjectData = {
    tasks: Task[];
    timeEst: number;
    totalCost: number;
    numberOfEngineers: number;
    risks: string;
};

export default ProjectData;
