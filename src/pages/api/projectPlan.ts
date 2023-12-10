import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    message: string;
};

type RequestData = {
    backend: string;
    sow: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    const { backend, sow }: RequestData = req.body;
    res.status(200).json({
        message: `${backend} ${sow}`,
    });
}
