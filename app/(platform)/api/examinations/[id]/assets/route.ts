export const dynamic = "force-dynamic";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { NextResponse } from "next/server";
import { logger } from "src/services/logger";
import { v4 as uuidv4 } from "uuid";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { contentType } = await request.json();
  const filename = uuidv4();
  const contentDisposition = `attachment; filename="${filename}"`;
  const { id } = params;

  if (
    contentType !== "image/jpg" &&
    contentType !== "image/png" &&
    contentType !== "image/jpeg"
  ) {
    return NextResponse.json(
      { message: "Unsupported content type" },
      {
        status: 400
      }
    );
  }

  try {
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `reports/assets/${id}/${filename}`,
      Conditions: [
        ["content-length-range", 0, 1073741824], // up to 1 GB
        ["starts-with", "$Content-Type", contentType],
        ["starts-with", "$Content-Disposition", "attachment"]
      ],
      Fields: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition
      },
      Expires: 600 // Seconds before the presigned post expires. 3600 by default.
    });

    return NextResponse.json({ url, fields });
  } catch (error: any) {
    logger.error("Failed to upload the file.", { error, filename: filename });

    return NextResponse.json(
      { message: "Failed to upload the file", error, filename: filename },
      { status: 500 }
    );
  }
};

export async function OPTIONS() {
  return NextResponse.json({});
}
