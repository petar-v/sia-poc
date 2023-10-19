import React, { useState } from "react";
import { Button, Input } from "antd";

export type SoWInputProps = {
    onSubmit: (sow: string) => void;
};

export default function SoWInput({ onSubmit }: SoWInputProps) {
    const [value, setValue] = useState("");
    const submitSoW = () => {
        // TODO: Add validation
        onSubmit(value);
    };

    return (
        <>
            <Input.TextArea
                className="h-full mb-5"
                showCount
                allowClear={true}
                placeholder="Input your Statement of Work here..."
                autoSize={{ minRows: 6 }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onPressEnter={submitSoW}
            />
            <Button type="primary" onClick={submitSoW}>
                Create Project Plan
            </Button>
        </>
    );
}
