import React, { useState } from "react";
import { Button, Input } from "antd";

export default function SoWInput() {
  const [value, setValue] = useState("");
  const submitSoW = () => {
    console.log("SOW", value);
  };

  return (
    <>
      <h2>Input Statement of Work</h2>
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
