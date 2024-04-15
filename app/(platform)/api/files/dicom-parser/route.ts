import { logger } from "src/services/logger";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dicomParser from "dicom-parser";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

async function streamToArrayBuffer(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).buffer;
}

export async function GET(request: Request) {
  const urlParams = new URL(request.url).searchParams;
  const keys = urlParams.get("keys")?.split(",")!;
  const files: { studyInstanceUid: string; key: string }[] = [];

  try {
    await Promise.all(
      keys.map(async (key) => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key as string
        };

        const data = await client.send(new GetObjectCommand(params));

        const arrayBuffer = await streamToArrayBuffer(data.Body);
        const byteArray = new Uint8Array(arrayBuffer);

        logger.log("Document loaded and converted to byte array.");

        const dataSet = dicomParser.parseDicom(byteArray);
        const studyInstanceUid = dataSet.string("x0020000d");

        if (!studyInstanceUid) {
          logger.error("Impossible to find the study instance uid", { key });
          throw Error("Impossible to find the study instance uid");
        }

        logger.log("studyInstanceUid: ", studyInstanceUid);

        files.push({ studyInstanceUid, key });
      })
    );

    return NextResponse.json({ files });
  } catch (error) {
    logger.error("Failed to parse dicom file.", { error, keys });

    return NextResponse.json(
      { message: "Failed to parse dicom file", error, keys },
      { status: 500 }
    );
  }
}
