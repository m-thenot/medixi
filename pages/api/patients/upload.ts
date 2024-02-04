import { put } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchParams } = new URL(`${process.env.KINDE_SITE_URL}${req.url!}`);
  const filename = searchParams.get("filename")!;

  try {
    const blob = await put(`exams/${filename}`, req, {
      access: "public",
    });

    res.status(200).json(blob);
  } catch (e) {
    console.error("Failed to upload the file.", { e, filename: filename });
    res.status(500).json({ error: e });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
