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

export const options: { value: backend; label: string }[] = [
    { value: "openai", label: "ChatGPT 3.5 Turbo" },
    { value: "dummy", label: "Dummy offline data" },
];
