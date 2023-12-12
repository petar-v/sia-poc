export type ChatSession = {
    prompt: (prompt: string) => Promise<ReadableStream<string>>;
    statementOfWorkToProjectPlan: (
        statementOfWork: string,
    ) => Promise<ReadableStream<string>>;
};
