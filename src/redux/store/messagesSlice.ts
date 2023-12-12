import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState, ThunkApi } from "./";
import { Message } from "@/llm-backend/chatSession";
import { Backend } from "@/llm-backend/backend";
import { selectBackendState } from "./backendSlice";

export type ChatMessage = Message & {
    origin: Backend;
};

export interface MessagesState {
    messages: ChatMessage[];
    awaitingReply: boolean;
}

const initialState: MessagesState = {
    messages: [],
    awaitingReply: false,
};

const blankAssistantMessage: ChatMessage = {
    role: "assistant",
    content: "",
    origin: "dummy",
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<ChatMessage>) {
            state.messages.push(action.payload);
        },
        updateLastMessage(state, action: PayloadAction<string>) {
            const message = state.messages.pop() || blankAssistantMessage;
            message.content = message.content + action.payload;
            state.messages.push(message);
        },
        setAwaitingReply(state, action: PayloadAction<boolean>) {
            state.awaitingReply = action.payload;
        },
    },
});

const { addMessage } = messagesSlice.actions;
export const { updateLastMessage, setAwaitingReply } = messagesSlice.actions;

// TODO: Ideally this should return a ReadableStream for use only in the UI
export const prompt = createAsyncThunk<void, string, ThunkApi>(
    "socket/initializeSocket",
    async (prompt, { extra, dispatch, getState }) => {
        const socket = extra;
        const backend = selectBackendState(getState());
        dispatch(setAwaitingReply(true));
        dispatch(
            addMessage({
                role: "user",
                content: prompt,
                origin: backend,
            }),
        );
        // add blank placeholder message for the assistant's reply.
        dispatch(
            addMessage({
                ...blankAssistantMessage,
                origin: backend,
            }),
        );
        socket.emit("prompt", prompt);
    },
);

export const selectMessages = (state: AppState) =>
    state[messagesSlice.name].messages;

export const selectIsAwaitingReply = (state: AppState) =>
    state[messagesSlice.name].awaitingReply;

export default messagesSlice.reducer;
