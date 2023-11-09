import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./";

export interface ProjectState {
    statementOfWork: string | null;
}

const initialState: ProjectState = {
    statementOfWork: null,
};

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setStatementOfWork(state, action) {
            state.statementOfWork = action.payload;
        },
    },
});

export const { setStatementOfWork } = projectSlice.actions;

export const selectSoW = (state: AppState) =>
    state[projectSlice.name].statementOfWork;

export default projectSlice.reducer;
