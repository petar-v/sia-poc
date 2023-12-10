import LLMPrompt from "./llmPrompt";

import { prompt as chatgpt } from "./chatgpt";
import { prompt as dummy } from "./dummy";

export type backend = "openai" | "dummy";
export const DEFAULT_BACKEND = "openai";

type BackendBase = {
    name: backend;
};

export interface OpenAIBackend extends BackendBase {
    name: "openai";
    apiKey: string;
    orgKey: string;
}

export interface DummyBackend extends BackendBase {
    name: "dummy";
}

export const getBackend = (backend: OpenAIBackend | DummyBackend) => {
    if (backend.name === "openai") {
        const oiBackend = backend as OpenAIBackend;
        return (prompt: LLMPrompt) => chatgpt(oiBackend.apiKey, prompt);
    }
    return dummy;
};

export const options: { value: backend; label: string }[] = [
    { value: "openai", label: "ChatGPT 3.5 Turbo" },
    { value: "dummy", label: "Dummy offline data" },
];
