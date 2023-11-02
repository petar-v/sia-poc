import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import backendReducer from "./state/backendSlice";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

const combinedReducer = combineReducers({
    backend: backendReducer,
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

const makeStore = () => configureStore({ reducer });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

// const dummyStore = makeStore(); // FIXME: get rid of this and use types inference instead
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof dummyStore.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof dummyStore.dispatch;

export const wrapper = createWrapper<AppStore>(makeStore);
