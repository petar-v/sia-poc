import React from "react";
import { Button, Input, Form, Space, Row, Card, Avatar } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";

import { Message } from "@/llm-backend/chatSession";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectIsAwaitingReply,
    selectMessages,
    prompt,
} from "@/redux/store/messagesSlice";

export type ChatProps = {
    disabled: boolean;
};

type FieldType = {
    message: string;
};

function MessageDisplay({ message }: { message: Message }) {
    const title = message.role === "user" ? "You" : "Assistant";
    const avatar =
        message.role === "assistant" ? (
            <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<RobotOutlined />}
            >
                Assistant
            </Avatar>
        ) : (
            <Avatar
                style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                icon={<UserOutlined />}
            >
                User
            </Avatar>
        );

    return (
        <Card bordered={true} size="small" style={{ width: "100%" }}>
            <Card.Meta
                avatar={avatar}
                title={title}
                description={message.content}
            />
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
                    >
                        Send
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
