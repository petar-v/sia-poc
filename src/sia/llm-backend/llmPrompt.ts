import ProjectData, { Task, ProjectInfo } from "../projectData";

type LLMPrompt = {
    prompt: string;
    onDataChunk?: (
        incompleteProjectData: ProjectData,
        chunk: Task | ProjectInfo,
    ) => void;
    onFinish?: (projectData: ProjectData) => void;
};

export default LLMPrompt;
