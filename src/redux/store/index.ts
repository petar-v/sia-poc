import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "@reduxjs/toolkit";

import backendReducer from "./backendSlice";
import projectReducer from "./projectSlice";
import socketReducer from "./socketSlice";
import { createSocket } from "@/lib/socket";

const combinedReducer = combineReducers({
    backend: backendReducer,
    project: projectReducer,
    socket: socketReducer,
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

const socket = createSocket();
type SocketType = typeof socket;

const makeStore = () =>
    configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== "production",
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: socket,
                },
                serializableCheck: false,
            }),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    SocketType,
    Action
>;

export type ThunkApi = {
    extra: SocketType;
    state: AppState;
};

export const store = makeStore(); // FIXME: get rid of this and use types inference instead
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper<AppStore>(makeStore);
