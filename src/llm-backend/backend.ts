import { ChatSession, Message } from "./chatSession";
import { createChatSession as dummyChatSession } from "./dummy";
import { createChatSession as openAiChatSession } from "./openai";

export type Backend = "openai" | "dummy";
export const DEFAULT_BACKEND: Backend = "openai";
// FIXME: load default backend from env

type BackendBase = {
    name: Backend;
};

export interface OpenAIBackend extends BackendBase {
    name: "openai";
    apiKey: string;
    orgKey: string;
}

export interface DummyBackend extends BackendBase {
    name: "dummy";
}

export const options: { value: Backend; label: string }[] = [
    { value: "openai", label: "ChatGPT 3.5 Turbo" },
    { value: "dummy", label: "Dummy offline data" },
];

export const createChatSessionFromBackend = (
    backend: BackendBase,
    history?: Message[],
): ChatSession => {
    if (backend.name === "openai") {
        const openaiBackend = backend as OpenAIBackend;
        const session = openAiChatSession(
            openaiBackend.apiKey,
            openaiBackend.orgKey,
            history,
        );
        return session;
    }
    return dummyChatSession(history);
};
