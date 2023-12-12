import OpenAI from "openai";

import promptContext from "./promptText.txt";
import { ChatSession, Message } from "../chatSession";

const model = "gpt-3.5-turbo";

export function createChatSession(
    apiKey: string,
    orgKey: string,
    history: Message[] = [],
): ChatSession {
    const openai = new OpenAI({
        apiKey: apiKey,
        organization: orgKey,
        dangerouslyAllowBrowser: true,
    });
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        // FIXME: Fix role conversion
        messages: history.map((h) => ({
            ...h,
            role: h.role === "user" ? "user" : "assistant",
            name: "",
        })), // TODO: make message type conversion helpers
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
                    })
                    .on("message", (message) => {
                        params.messages.push(message);
                    });
            },
            cancel() {
                chatGPTStream.abort();
                params.messages.push({
                    role: "assistant",
                    content: "Aborted message.",
                });
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
                        controller.enqueue(JSON.parse(buffer));
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
                controller.close();
            },
            cancel() {
                reply.cancel();
            },
        });
    };

    return {
        backend: "openai",
        getMessages: () =>
            params.messages.map((msg) => ({
                role: msg.role,
                content: ((content) => {
                    if (!content) return "";
                    if (typeof content === "string") {
                        return content;
                    }
                    return "Unparsable message."; // FIXME: figure out how to serialize the ChatCompletionPart[]
                })(msg.content),
            })),
        prompt,
        statementOfWorkToProjectPlan,
    };
}
