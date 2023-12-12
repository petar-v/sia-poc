import React from "react";
import { ConfigProvider, Result, Divider, List, Checkbox } from "antd";

import ReloadButton from "@/components/elements/reloadButton";

import { Issue } from "@/lib/projectData";

type IssueDisplayProps = Issue & {};

export default function IssueDisplay({
    mainIssue,
    feedback,
    thingsToFix,
}: IssueDisplayProps) {
    return (
        <ConfigProvider // fixme: extract to providers
            theme={{
                components: {
                    Result: {
                        iconFontSize: 32,
                    },
                },
            }}
        >
            <Result
                status="404"
                title={mainIssue}
                subTitle="Please look at the provided feedback below and fix the issues."
                extra={<ReloadButton type="primary" />}
            />
            <div className="my-2">
                <Divider orientation="left">Feedback</Divider>
                <p>{feedback}</p>
            </div>
            {thingsToFix && (
                <div className="my-2">
                    <Divider orientation="left">Things to fix</Divider>
                    <List
                        bordered
                        dataSource={thingsToFix}
                        renderItem={(item) => (
                            <List.Item>
                                <Checkbox>{item}</Checkbox>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </ConfigProvider>
    );
}
