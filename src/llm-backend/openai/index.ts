import OpenAI from "openai";

import promptContext from "../promptText.txt";

export type ChatSession = {
    prompt: (prompt: string) => Promise<ReadableStream<string>>;
    statementOfWorkToProjectPlan: (
        statementOfWork: string,
    ) => Promise<ReadableStream<string>>;
};

const model = "gpt-3.5-turbo";

function createChatSession(apiKey: string, orgKey: string): ChatSession {
    const openai = new OpenAI({
        apiKey: apiKey,
        organization: orgKey,
        dangerouslyAllowBrowser: true,
    });

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [],
        stream: true,
        model,
    };

    const prompt = async (message: string): Promise<ReadableStream> => {
        params.messages.push({ role: "user", content: message });
        const chatGPTStream = await openai.beta.chat.completions.stream(params);

        return new ReadableStream({
            start(controller) {
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
    const statementOfWorkToProjectPlan = async (
        sow: string,
    ): Promise<ReadableStream> => {
        const reply = await prompt(`${promptContext} \n ${sow}`);

        return new ReadableStream({
            async start(controller) {
                const reader = reply.getReader();

                let buffer = "";
                let fullReply = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }

                    const delta = value || "";
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
                        .forEach((jsonStringLine) => {
                            controller.enqueue(JSON.parse(jsonStringLine));
                        });
                }
                controller.enqueue(JSON.parse(buffer));
                controller.close();
            },
            cancel() {
                reply.cancel();
            },
        });
    };

    return {
        prompt,
        statementOfWorkToProjectPlan,
    };
}

export default createChatSession;
