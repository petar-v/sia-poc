import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState, ThunkApi } from "./";
import { DEFAULT_BACKEND, Backend } from "@/llm-backend/backend";

export interface BackendState {
    backend: Backend;
}

const initialState: BackendState = {
    backend: DEFAULT_BACKEND,
};

export const backendSlice = createSlice({
    name: "backend",
    initialState,
    reducers: {
        setBackend(state, action) {
            state.backend = action.payload;
        },
    },
});

export const setBackend = createAsyncThunk<void, Backend, ThunkApi>(
    "socket/initializeSocket",
    async (backend: Backend, { extra, dispatch }) => {
        const socket = extra;
        socket.emit("backend-switch", backend);
        dispatch(backendSlice.actions.setBackend(backend));
    },
);

export const selectBackendState = (state: AppState) =>
    state[backendSlice.name].backend;

export default backendSlice.reducer;
