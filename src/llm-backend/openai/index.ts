import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs"; // FIXME: WTF is even this

export interface ChatSession {
    prompt: (prompt: string) => ReadableStream<string>;
}

function createChatSession(apiKey: string): ChatSession {
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    const messages: ChatCompletionMessageParam[] = [];

    const prompt = (message: string) => {
        messages.push({ role: "user", content: message });
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages,
            model: "gpt-3.5-turbo",
            stream: true,
        };

        const chatGPTStream = openai.beta.chat.completions
            .stream(params)
            .on("message", (message: ChatCompletionMessageParam) => {
                messages.push(message);
                console.log("ALL MESSAGES", messages);
            });
        return chatGPTStream.toReadableStream();
    };

    return {
        prompt,
    };
}

export default createChatSession;
