export type Message = {
    role: "function" | "user" | "assistant" | "system" | "tool";
    content: string;
};

export type ChatSession = {
    getMessages: () => Message[];
    prompt: (prompt: string) => Promise<ReadableStream<string>>;
    statementOfWorkToProjectPlan: (
        statementOfWork: string,
    ) => Promise<ReadableStream<string>>;
};
