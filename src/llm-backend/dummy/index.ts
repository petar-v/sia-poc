import { ChatSession } from "../chatSession";
import dummyResponse from "./dummyResp.ndjson";

const defaultAnswer = "I'm sorry, I am just a dummy and don't know anything.";
function createChatSession(): ChatSession {
    const messages: { role: "user" | "assistant"; content: string }[] = [];

    const prompt = async (message: string): Promise<ReadableStream> => {
        messages.push({ role: "user", content: message });

        return new ReadableStream({
            start(controller) {
                controller.enqueue(defaultAnswer);
                messages.push({ role: "assistant", content: defaultAnswer });
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
                controller.enqueue(dummyResponse);
                messages.push({ role: "assistant", content: defaultAnswer });
                controller.close();
            },
        });
    };

    return {
        prompt,
        statementOfWorkToProjectPlan,
    };
}

export default createChatSession;
