import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { wrapper } from "@/redux/store";
import { SocketProvider } from "@/lib/providers/socketProvider";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { selectBackendState, setBackend } from "@/redux/store/backendSlice";

import Header from "@/components/header";
import Wizard from "@/components/wizard";

import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { v4 as uuidv4 } from "uuid";

// TODO: Extract this to a middleware
export const getServerSideProps = (async (context) => {
    // const session = await getIronSession<SessionData>(
    //     context.req,
    //     context.res,
    //     sessionOptions,
    // );

    const session: SessionData = { id: "" };

    if (!session.id) {
        // TODO: create a login page with some context or whatever
        // Currently, I'm just generating a session ID for each new session.
        // FIXME: Better session management
        session.id = uuidv4();
        // await session.save();
    }

    return { props: { session } };
}) satisfies GetServerSideProps<{
    session: SessionData;
}>;

const defaultBackend = "openai";

const App = () => {
    const backend = useAppSelector(selectBackendState);
    const dispatch = useAppDispatch();

    const options = [
        { value: "openai", label: "ChatGPT 3.5 Turbo" },
        { value: "dummy", label: "Dummy offline data" },
    ];

    useEffect(() => {
        // switch to openAI backend by default
        dispatch(setBackend(defaultBackend));
    }, [dispatch]);

    return (
        <>
            <Header>
                <Space wrap>
                    <Button
                        type="dashed"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            location.reload();
                        }}
                    >
                        Reload
                    </Button>
                    <Select
                        options={options}
                        defaultValue={backend.name}
                        value={backend.name}
                        onChange={(value: "openai" | "dummy") => {
                            console.log("Backend set to", value);
                            dispatch(setBackend(value));
                        }}
                    />
                </Space>
            </Header>
            <main className="flex flex-col p-16">
                <Wizard />
            </main>
        </>
    );
};

// Note: if the session changes, this will reconnect to the websocket
const WrappedApp = ({
    session,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
    const { store, props } = wrapper.useWrappedStore({});
    return (
        <ReduxProvider store={store}>
            <SocketProvider session={session}>
                <App {...props} />
            </SocketProvider>
        </ReduxProvider>
    );
};

export default WrappedApp;
