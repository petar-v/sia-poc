type Task = {
    title: string;
    description: string;
    timeEst: number;
    detailedTask: string;
};

type ProjectData = {
    tasks: Task[];
    timeEst: number;
    totalCost: number;
    numberOfEngineers: number;
};

export default ProjectData;
