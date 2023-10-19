import OpenAI from "openai";
import ProjectData from "../projectData";
import dummyResp from "./dummy/dummyResp.json";
import promptTxt from "./promptText.txt";

export const prompt = async (
    api: string,
    prompt: string,
): Promise<ProjectData | null> => {
    const openai = new OpenAI({
        apiKey: api,
        dangerouslyAllowBrowser: true, // FIXME: this exposes the key. Create a backend.
    });

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: "user", content: promptTxt + prompt }],
        model: "gpt-3.5-turbo",
    };

    const chatCompletion: OpenAI.Chat.ChatCompletion =
        await openai.chat.completions.create(params);

    console.log("chat gpt", chatCompletion.choices);

    const reply = chatCompletion.choices[0].message.content || "";
    const projDataParsed: ProjectData = JSON.parse(reply);

    console.log("reply", reply);

    return projDataParsed;
};

export const promptDummy = async (
    prompt: string,
): Promise<ProjectData | null> => {
    console.log("Dummy prompt", promptTxt + prompt);
    return new Promise((resolve) => setTimeout(() => resolve(dummyResp), 2000));
};
