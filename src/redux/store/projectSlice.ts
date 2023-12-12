import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState, ThunkApi } from "./";
import ProjectData, { Issue } from "@/lib/projectData";

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
        setSoW(state, action) {
            state.statementOfWork = action.payload;
        },
        setProjectPlan(state, action) {
            state.projectPlan = action.payload;
        },
        setIssue(state, action) {
            state.issue = action.payload;
        },
    },
    // TODO: add error handling
    extraReducers(builder) {
        builder
            .addCase(setStatementOfWork.pending, (state, action) => {
                state.awaitingBackend = true;
                return state;
            })
            .addCase(setStatementOfWork.fulfilled, (state, action) => {
                state.awaitingBackend = false;
                return state;
            })
            .addCase(setStatementOfWork.rejected, (state, action) => {
                console.error(action.error.message);
            });
    },
});

const { setSoW } = projectSlice.actions;

export const { setProjectPlan, setIssue } = projectSlice.actions;

export const setStatementOfWork = createAsyncThunk<void, string, ThunkApi>(
    "project/setSoW",
    async (sow: string, thunkAPI) => {
        thunkAPI.dispatch(setSoW(sow));
        thunkAPI.extra.emit("sow", sow);
    },
);

export const selectSoW = (state: AppState) =>
    state[projectSlice.name].statementOfWork;

export const selectProjectPlan = (state: AppState) =>
    state[projectSlice.name].projectPlan;

export const selectIssue = (state: AppState) => state[projectSlice.name].issue;

export const selectProjectStage = (state: AppState): ProjectStage => {
    const { statementOfWork, awaitingBackend, projectPlan, issue } =
        state[projectSlice.name];

    if (issue) return ProjectStage.ISSUES;

    if (!projectPlan && !statementOfWork) return ProjectStage.INITIAL;

    if (projectPlan && !awaitingBackend) return ProjectStage.COMPLETED;

    if (statementOfWork) return ProjectStage.PROCESSING;

    return ProjectStage.ISSUES;
};

export default projectSlice.reducer;
