import { useEffect, useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import type { AppProps } from "next/app";
import { AppStore, wrapper } from "@/redux/store";

import { v4 as uuidv4 } from "uuid";

import "@/styles/globals.scss";
import { SessionData } from "@/lib/session";
import { initializeSocket, disconnectSocket } from "@/redux/store/socketSlice";

function MyApp({
    Component,
    session,
    ...rest
}: AppProps & { session: SessionData }) {
    const storeRef = useRef<{ store: AppStore; props: any }>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = wrapper.useWrappedStore(rest);
    }
    const { store, props } = storeRef?.current;
    const { pageProps } = props;

    useEffect(() => {
        console.log("Obtained a session, dispatching socket init");
        store.dispatch(initializeSocket(session));
        return () => {
            store.dispatch(disconnectSocket());
        };
    }, [session, store]);

    return (
        <ReduxProvider store={store}>
            <Component {...pageProps} />
        </ReduxProvider>
    );
}

// TODO: Extract this to a middleware
MyApp.getInitialProps = async () => {
    // TODO: create a login page with some context or whatever
    // Currently, I'm just generating a session ID for each new session.
    // FIXME: Better session management
    const session: SessionData = {
        id: uuidv4(),
    };
    return { session };
};

export default MyApp;
