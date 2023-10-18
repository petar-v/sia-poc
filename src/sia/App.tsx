"use client";
import React, { useState } from "react";

import SoWInput from "./components/sowInput";

export type AppProps = {
  ApiKey: string;
};

export default function App(props: AppProps) {
  const [sow, setSow] = useState("");

  const onSubmit = (sow: string) => {
    console.log(sow);
    setSow(sow);
  };

  if (sow) {
    return <>{sow}</>;
  }

  return (
    <>
      <SoWInput onSubmit={onSubmit} />
    </>
  );
}
