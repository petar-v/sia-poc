import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { AppState } from "../store";

import Backend from "../llm-backend/backend";

export interface BackendState {
    backend: Backend;
}

const initialState: BackendState = {
    backend: {
        name: "dummy",
    },
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
