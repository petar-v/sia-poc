import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { wrapper } from "@/redux/store";
import { SocketProvider } from "@/lib/providers/socketProvider";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { Select, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { selectBackendState, setBackend } from "@/redux/store/backendSlice";

import Header from "@/components/header";
import Wizard from "@/components/wizard";

import { SessionData } from "@/lib/session";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_BACKEND, options } from "@/llm-backend/backend";

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

const App = () => {
    const backend = useAppSelector(selectBackendState);
    const dispatch = useAppDispatch();
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
                        defaultValue={DEFAULT_BACKEND}
                        value={backend}
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
