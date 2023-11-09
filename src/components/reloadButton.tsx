import React from "react";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

type ReloadButtonProps = {
    type?: "primary" | "dashed";
};

export default function ReloadButton({ type }: ReloadButtonProps) {
    return (
        <Button
            type={type || "dashed"}
            icon={<ReloadOutlined />}
            onClick={() => {
                location.reload();
            }}
        >
            Reload
        </Button>
    );
}
