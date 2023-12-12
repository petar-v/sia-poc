import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState, ThunkApi } from "./";
import { SessionData } from "@/lib/session";

export interface SocketState {
    isConnected: boolean;
    auth: SessionData | null;
}

const initialState: SocketState = {
    isConnected: false,
    auth: null,
};

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setConnected(state, action) {
            state.isConnected = action.payload;
        },
        setAuth(state, action) {
            state.auth = action.payload;
        },
    },
});

const { setConnected, setAuth } = socketSlice.actions;

export const isConnected = (state: AppState) =>
    state[socketSlice.name].isConnected;

export const getAuth = (state: AppState) => state[socketSlice.name].auth;

export const initializeSocket = createAsyncThunk<void, SessionData, ThunkApi>(
    "socket/initializeSocket",
    async (session: SessionData, { extra, dispatch, getState }) => {
        if (isConnected(getState())) {
            return;
        }
        // TODO: error handling
        await fetch("/api/socket");
        const socket = extra;
        socket.auth = session;
        dispatch(setAuth(session));
        socket.on("connect", () => {
            dispatch(setConnected(true));
            console.log("connected to the socket via redux", session.id);
        });
        socket.on("disconnect", () => {
            dispatch(setConnected(false));
        });
        socket.connect();
    },
);

export const disconnectSocket = createAsyncThunk<void, void, ThunkApi>(
    "socket/initializeSocket",
    async (_, { extra, getState }) => {
        // TODO: error handling
        if (!isConnected(getState())) {
            return;
        }
        const socket = extra;
        socket.disconnect();
    },
);

export default socketSlice.reducer;
