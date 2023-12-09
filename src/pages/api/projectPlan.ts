import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
};

type RequestData = {
    backend: string;
    sow: string;
};

const openAIkey = process.env.OPENAI_API_KEY || "";
const openAIorg = process.env.OPENAI_ORG_ID || "";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    const { backend, sow }: RequestData = req.body;
    res.status(200).json({
        message: `${backend} ${sow}`,
    });
}
