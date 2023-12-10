import OpenAI from "openai";

export type ChatSession = {
    prompt: (prompt: string) => Promise<ReadableStream<string>>;
};

function createChatSession(apiKey: string): ChatSession {
    const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
    });

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    const prompt = async (message: string): Promise<ReadableStream> => {
        messages.push({ role: "user", content: message });

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages,
            model: "gpt-3.5-turbo",
            stream: true,
        };

        const chatGPTStream = await openai.beta.chat.completions.stream(params);

        return new ReadableStream({
            start(controller) {
                // on chunk from gpt
                chatGPTStream
                    .on("chunk", (chunk) => {
                        controller.enqueue(
                            chunk.choices[0]?.delta?.content || "",
                        );
                    })
                    .on("chatCompletion", () => {
                        controller.close();
                    });
            },
            cancel() {
                chatGPTStream.abort();
            },
        });
    };

    return {
        prompt,
    };
}

export default createChatSession;
