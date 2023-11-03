import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./";
import ProjectData, { Issue } from "@/projectData";

export interface ProjectState {
    statementOfWork: string | null;
    awaitingBackend: boolean;
    projectPlan: ProjectData | null;
    issue: Issue | null;
}

const initialState: ProjectState = {
    statementOfWork: null,
    awaitingBackend: false,
    projectPlan: null,
    issue: null,
};

// The Application is going to be powered by a state machine for setting up a project.
export enum ProjectStage {
    INITIAL, // a new project is started.
    ISSUES, // the project plan has issues that need to be fixed.
    PROCESSING, // the project plan is being created.
    COMPLETED, // the project plan is created.
}

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        // TODO: add type check for the action
        setStatementOfWork(state, action) {
            state.statementOfWork = action.payload;
        },

        // FIXME: use thunks: https://redux.js.org/tutorials/essentials/part-5-async-logic
        setAwaitingBackend(state, action) {
            state.awaitingBackend = action.payload;
        },
        setProjectPlan(state, action) {
            state.projectPlan = action.payload;
        },
        setIssue(state, action) {
            state.issue = action.payload;
        },
    },
});

export const {
    setStatementOfWork,
    setAwaitingBackend,
    setProjectPlan,
    setIssue,
} = projectSlice.actions;

export const selectSoW = (state: AppState) =>
    state[projectSlice.name].statementOfWork;

export const selectProjectPlan = (state: AppState) =>
    state[projectSlice.name].projectPlan;

export const selectIssue = (state: AppState) => state[projectSlice.name].issue;

export const selectProjectStage = (state: AppState): ProjectStage => {
    const { statementOfWork, awaitingBackend, projectPlan } =
        state[projectSlice.name];
    if (!projectPlan && !statementOfWork) return ProjectStage.INITIAL;

    if (projectPlan && !awaitingBackend) {
        return ProjectStage.COMPLETED;
    }

    if (statementOfWork) return ProjectStage.PROCESSING;

    return ProjectStage.ISSUES;
};

export default projectSlice.reducer;
