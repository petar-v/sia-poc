import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState, ThunkApi } from "./";
import { Message } from "@/llm-backend/chatSession";

export interface MessagesState {
    messages: Message[];
    awaitingReply: boolean;
}

const initialState: MessagesState = {
    messages: [],
    awaitingReply: false,
};

const blankAssistantMessage: Message = {
    role: "assistant",
    content: "",
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        updateLastMessage(state, action: PayloadAction<string>) {
            const message: Message =
                state.messages.pop() || blankAssistantMessage;
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
    async (prompt, { extra, dispatch }) => {
        const socket = extra;
        dispatch(setAwaitingReply(true));
        dispatch(
            addMessage({
                role: "user",
                content: prompt,
            }),
        );
        // add blank placeholder message for the assistant's reply.
        dispatch(addMessage(blankAssistantMessage));
        socket.emit("prompt", prompt);
    },
);

export const selectMessages = (state: AppState) =>
    state[messagesSlice.name].messages;

export const selectIsAwaitingReply = (state: AppState) =>
    state[messagesSlice.name].awaitingReply;

export default messagesSlice.reducer;
