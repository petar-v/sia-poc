import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

import backendReducer from "./backendSlice";
import projectReducer from "./projectSlice";

const combinedReducer = combineReducers({
    backend: backendReducer,
    project: projectReducer,
});

const reducer: typeof combinedReducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state,
            ...action.payload,
        };
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

const makeStore = () =>
    configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== "production",
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const store = makeStore(); // FIXME: get rid of this and use types inference instead
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper<AppStore>(makeStore);
