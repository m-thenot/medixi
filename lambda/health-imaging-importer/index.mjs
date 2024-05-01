import {
  StartDICOMImportJobCommand,
  MedicalImagingClient
} from "@aws-sdk/client-medical-imaging";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import JSZip from "jszip";

const s3Client = new S3Client();
const medicalImagingClient = new MedicalImagingClient();

/**
 * @param {string} jobName - The name of the import job.
 * @param {string} datastoreId - The ID of the data store.
 * @param {string} dataAccessRoleArn - The Amazon Resource Name (ARN) of the role that grants permission.
 * @param {string} inputS3Uri - The URI of the S3 bucket containing the input files.
 * @param {string} outputS3Uri - The URI of the S3 bucket where the output files are stored.
 */
export const startDicomImportJob = async (jobName, bucketName, inputS3Uri) => {
  const response = await medicalImagingClient.send(
    new StartDICOMImportJobCommand({
      jobName: jobName,
      datastoreId: process.env.DATASTORE_ID,
      dataAccessRoleArn:
        "arn:aws:iam::730335225700:role/ImportJobDataAccessRole",
      inputS3Uri: inputS3Uri,
      outputS3Uri: `s3://${bucketName}/outputs/`
    })
  );
  return response;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const unzip = async (key, bucketName, inputFolder) => {
  const getObjectParams = {
    Bucket: bucketName,
    Key: key
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(getObjectParams));
    const zipBuffer = await streamToBuffer(data.Body);
    const zip = await JSZip.loadAsync(zipBuffer);

    const filePromises = Object.keys(zip.files).map(async (fileName) => {
      const file = zip.files[fileName];

      if (!file.dir && fileName.includes("dcm")) {
        const content = await file.async("nodebuffer");
        const uploadParams = {
          Bucket: bucketName,
          Key: `${inputFolder}/zip/${fileName}`,
          Body: content,
          ContentType: "application/dicom"
        };

        const uploader = new Upload({
          client: s3Client,
          params: uploadParams
        });

        await uploader.done();
      } else {
        console.log(`Skipping non-DICOM file: ${fileName}`);
      }
    });

    await Promise.all(filePromises);
    console.log("Unzip and uploaded successfully!");
  } catch (error) {
    console.error(`Error processing ${key}: ${error}`);
    throw error;
  }
};

export const handler = async (event) => {
  const key = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;

  const lastSlashIndex = key.lastIndexOf("/");
  let inputFolder = key.substring(0, lastSlashIndex);

  if (key.includes("/zip")) {
    console.log(
      "Ignore uncompressed dicom files, they already have been imported."
    );

    return;
  }

  if (key.toLowerCase().endsWith(".zip")) {
    console.log("Uploaded file is a ZIP...");
    await unzip(key, bucketName, inputFolder);
    inputFolder = `${inputFolder}/zip`;
  }

  console.log("Input folder:", `s3://${bucketName}/${inputFolder}/`);

  const importResponse = await startDicomImportJob(
    key.split("/")[1],
    bucketName,
    `s3://${bucketName}/${inputFolder}/`
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify(importResponse)
  };

  return response;
};
