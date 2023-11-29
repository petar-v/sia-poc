import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
};

const openAIkey = process.env.OPENAI_API_KEY || "";
const openAIorg = process.env.OPENAI_ORG_ID || "";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    res.status(200).json({
        message: `${openAIkey} ${openAIorg}`,
    });
}
