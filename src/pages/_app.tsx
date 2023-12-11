import { FC, useContext } from "react";
import { Provider as ReduxProvider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "@/redux/store";

import { v4 as uuidv4 } from "uuid";

import "@/styles/globals.scss";
import { SessionData } from "@/lib/session";
import { SocketContext, SocketProvider } from "@/lib/providers/socketProvider";

// Note: if the session changes, this will reconnect to the websocket
const ReduxWrappedApp: FC<AppProps> = ({ Component, ...rest }) => {
    const socket = useContext(SocketContext);
    const { store, props } = wrapper.useWrappedStore(rest);
    const { pageProps } = props;

    return (
        <ReduxProvider store={store}>
            <Component {...pageProps} />
        </ReduxProvider>
    );
};

function MyApp({
    Component,
    pageProps,
    session,
}: AppProps & { session: SessionData }) {
    console.log("sesssion _app, ", pageProps);
    return (
        <SocketProvider session={session}>
            Session ID: {session.id}
            <ReduxWrappedApp {...pageProps} Component={Component} />
        </SocketProvider>
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
