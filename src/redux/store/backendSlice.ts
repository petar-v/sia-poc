import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./";
import { DEFAULT_BACKEND, backend } from "@/llm-backend/backend";

export interface BackendState {
    backend: backend;
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

export const { setBackend } = backendSlice.actions;

export const selectBackendState = (state: AppState) =>
    state[backendSlice.name].backend;

export default backendSlice.reducer;
