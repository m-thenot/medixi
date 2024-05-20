import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { logger } from "src/services/logger";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();
  const contentDisposition = `attachment; filename="${filename}"`;

  if (
    contentType !== "application/dicom" &&
    contentType !== "application/zip"
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
      Key: `inputs/${uuidv4()}/${filename}`,
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
}

export async function GET(request: Request) {
  const urlParams = new URL(request.url).searchParams;
  const filename = urlParams.get("filename");

  if (!filename) {
    return new Response(JSON.stringify({ message: "Filename is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename
    });

    // Expire after 30min
    const url = await getSignedUrl(client, command, { expiresIn: 1800 });

    return NextResponse.json({ url });
  } catch (error) {
    logger.error("Failed to generate download URL.", { error, filename });

    return NextResponse.json(
      { message: "Failed to generate download URL", error, filename },
      { status: 500 }
    );
  }
}
