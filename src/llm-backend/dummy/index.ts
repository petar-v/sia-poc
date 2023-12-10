import ProjectData from "@/lib/projectData";
import dummyResp from "./dummyResp.json";
import LLMPrompt from "../llmPrompt";

export const prompt = async (
    prompt: LLMPrompt,
): Promise<ProjectData | null> => {
    return new Promise((resolve) =>
        setTimeout(() => {
            const projData = dummyResp as ProjectData;
            prompt.onFinish && prompt.onFinish(projData);
            resolve(projData);
        }, 2000),
    );
};
