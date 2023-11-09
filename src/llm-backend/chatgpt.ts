import OpenAI from "openai";
import ProjectData, { Task, ProjectInfo } from "../projectData";
import promptContext from "./promptText.txt";
import LLMPrompt from "./llmPrompt";

export const prompt = async (
    apiKey: string,
    prompt: LLMPrompt,
): Promise<ProjectData | null> => {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // FIXME: this exposes the key. Create a backend. Could use cloudflare functions
    });

    const promptText = prompt.prompt;
    console.log("Prompt", promptContext + promptText);

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: "user", content: promptContext + promptText }],
        model: "gpt-3.5-turbo",
        stream: true,
    };

    const stream = await openai.chat.completions.create(params);

    let buffer = "";
    let fullReply = "";
    const projData: ProjectData = { info: undefined, tasks: [] };

    const populateFromBuffer = (chunk: string) => {
        const json = JSON.parse(chunk);
        if (json.type === "Task") {
            projData.tasks.push(json as Task);
        } else {
            projData.info = json as ProjectInfo;
        }
        prompt.onDataChunk && prompt.onDataChunk(projData, json);
    };

    for await (const part of stream) {
        const delta = part.choices[0]?.delta?.content || "";
        buffer += delta;
        fullReply += delta;
        const bufferSplit = buffer.split("\n");
        if (bufferSplit.length === 1) {
            continue;
        }
        const remainder = bufferSplit[bufferSplit.length - 1];
        buffer = remainder;
        bufferSplit
            .slice(0, bufferSplit.length - 1)
            .filter((l) => l.length > 0)
            .forEach(populateFromBuffer);
    }
    populateFromBuffer(buffer);

    prompt.onFinish && prompt.onFinish(projData);
    console.log("FULL REPLY", fullReply);
    return projData;
};