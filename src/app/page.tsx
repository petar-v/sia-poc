import React, { useState } from "react";

import { Select } from "antd";

import AppWrapper from "./appWrapper";

export default function Home() {
    const apiKey = process.env.OPENAI_API_KEY || "";
    return <AppWrapper ApiKey={apiKey} />;
}
