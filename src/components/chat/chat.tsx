import React from "react";
import { Button, Input, Form, Space, Row } from "antd";

export type ChatProps = {
    disabled: boolean;
};

type FieldType = {
    message: string;
};

export default function Chat({ disabled }: ChatProps) {
    const submitMessage = ({ message }: FieldType) => {};

    return (
        <Row>
            <Form layout="vertical" onFinish={submitMessage}>
                <Space direction="horizontal" size="large">
                    <Space.Compact block={true} style={{ width: "100%" }}>
                        <Form.Item<FieldType>
                            name="message"
                            rules={[
                                {
                                    required: false,
                                    message: "Please input your prompt.",
                                },
                            ]}
                        >
                            <Input
                                showCount
                                bordered
                                allowClear={true}
                                placeholder="Prompt SIA about the project."
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Message
                            </Button>
                        </Form.Item>
                    </Space.Compact>
                </Space>
            </Form>
        </Row>
    );
}
