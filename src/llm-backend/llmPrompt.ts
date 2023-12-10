import ProjectData, { Task, ProjectInfo, Issue } from "@/lib/projectData";

type LLMPrompt = {
    prompt: string;
    onDataChunk?: (
        incompleteProjectData: ProjectData,
        chunk: Task | ProjectInfo,
    ) => void;
    onFinish?: (projectData: ProjectData) => void;
    onIssue?: (issue: Issue) => void;
};

export default LLMPrompt;
