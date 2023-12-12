import React from "react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import rehypeRaw from 'rehype-raw';

import { Button, Input, Form, Space, Card, Avatar } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectIsAwaitingReply,
    selectMessages,
    prompt,
    ChatMessage,
} from "@/redux/store/messagesSlice";

export type ChatProps = {
    disabled: boolean;
};

type FieldType = {
    message: string;
};

const UserAvatar = (
    <Avatar
        style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
        icon={<UserOutlined />}
    >
        User
    </Avatar>
);

const DummyAIAvatar = <Avatar icon={<RobotOutlined />}>Dummy Assistant</Avatar>;

const OpenAIAvatar = (
    <Avatar style={{ backgroundColor: "#87d068" }} icon={<RobotOutlined />}>
        Smart Assistant
    </Avatar>
);

function MessageDisplay({ message }: { message: ChatMessage }) {
    const title = message.role === "user" ? "You" : "Assistant";
    const avatar =
        message.role === "assistant"
            ? message.origin === "openai"
                ? OpenAIAvatar
                : DummyAIAvatar
            : UserAvatar;

    const content = (
        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
    );
    return (
        <Card bordered={true} size="small" style={{ width: "100%" }}>
            <Card.Meta avatar={avatar} title={title} description={content} />
        </Card>
    );
}

export default function Chat({ disabled }: ChatProps) {
    // TODO: repopulate messages on mount for current session.
    const dispatch = useAppDispatch();

    const messages = useAppSelector(selectMessages);
    const isAwaitingReply = useAppSelector(selectIsAwaitingReply);

    const [form] = Form.useForm();

    const submitMessage = ({ message }: FieldType) => {
        dispatch(prompt(message));
        form.resetFields();
    };

    return (
        <>
            <Form
                form={form}
                onFinish={submitMessage}
                disabled={disabled || isAwaitingReply}
                layout="vertical"
            >
                <Form.Item<FieldType>
                    name="message"
                    rules={[
                        {
                            required: false,
                            message: "Please input your prompt.",
                        },
                    ]}
                    wrapperCol={{ offset: 0, span: 24 }}
                >
                    <Input.TextArea
                        showCount
                        bordered
                        allowClear={true}
                        placeholder="Prompt SIA about the project."
                        autoSize={{ minRows: 1, maxRows: 6 }}
                    />
                </Form.Item>
                {/* TODO: Fix the misalgned submit button */}
                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        htmlType="submit"
                        loading={isAwaitingReply}
                    >
                        {isAwaitingReply
                            ? "The AI is talking, shush!"
                            : "Send message"}
                    </Button>
                </Form.Item>
            </Form>
            {/* TODO: Maybe use a Timeline component? */}
            <Space direction="vertical" className="h-full">
                {messages.toReversed().map((message, index) => (
                    <MessageDisplay message={message} key={index} />
                ))}
            </Space>
        </>
    );
}
