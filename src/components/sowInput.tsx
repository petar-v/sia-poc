import React from "react";
import { Button, Input, Form } from "antd";

export type SoWInputProps = {
    onSubmit: (sow: string) => void;
};

type FieldType = {
    statementOfWork: string;
};

export default function SoWInput({ onSubmit }: SoWInputProps) {
    const submitSoW = (formValues: FieldType) => {
        onSubmit(formValues.statementOfWork);
    };

    return (
        <Form layout="vertical" onFinish={submitSoW}>
            <Form.Item<FieldType>
                name="statementOfWork"
                rules={[
                    {
                        required: true,
                        message: "Please input your Statement of Work!",
                    },
                ]}
            >
                <Input.TextArea
                    className="h-full mb-5"
                    showCount
                    bordered
                    allowClear={true}
                    placeholder="Please input your Statement of Work here..."
                    autoSize={{ minRows: 6 }}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
                <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                >
                    Create Project Plan
                </Button>
            </Form.Item>
        </Form>
    );
}
