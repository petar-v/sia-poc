import LLMPrompt from "./llmPrompt";

import { prompt as chatgpt } from "./chatgpt";
import { prompt as dummy } from "./dummy";

type BackendBase = {
    name: string;
};

export interface OpenAIBackend extends BackendBase {
    name: "openai";
    apiKey: string;
    orgKey: string;
}

export interface DummyBackend extends BackendBase {
    name: "dummy";
}

type Backend = OpenAIBackend | DummyBackend;

export const getBackend = (backend: Backend) => {
    if (backend.name === "openai") {
        const oiBackend = backend as OpenAIBackend;
        return (prompt: LLMPrompt) => chatgpt(oiBackend.apiKey, prompt);
    }
    return dummy;
};

export default Backend;
