import { ChatSession, Message } from "../chatSession";
import dummyResponse from "./dummyResp.ndjson";

const defaultAnswer = "I'm sorry, I am just a dummy and don't know anything.";
export function createChatSession(): ChatSession {
    const messages: Message[] = [];

    const prompt = async (message: string): Promise<ReadableStream> => {
        messages.push({ role: "user", content: message });

        return new ReadableStream({
            start(controller) {
                messages.push({ role: "assistant", content: defaultAnswer });
                controller.enqueue(defaultAnswer);
                controller.close();
            },
        });
    };
    const statementOfWorkToProjectPlan = async (
        sow: string,
    ): Promise<ReadableStream> => {
        messages.push({
            role: "user",
            content: `make me a project plan for: \n ${sow}`,
        });
        return new ReadableStream({
            async start(controller) {
                console.log("Streaming ", dummyResponse);
                `${dummyResponse}`.split("\n").forEach((line) => {
                    try {
                        controller.enqueue(JSON.parse(line));
                    } catch (e) {
                        return;
                    }
                });
                messages.push({ role: "assistant", content: defaultAnswer });
                controller.close();
            },
        });
    };

    return {
        prompt,
        getMessages: () => messages,
        statementOfWorkToProjectPlan,
    };
}
