type Task = {
  title: string;
  description: string;
  timeEst: number;
};

type ProjectData = {
  tasks: Task[];
  timeEst: number;
};

export default ProjectData;
