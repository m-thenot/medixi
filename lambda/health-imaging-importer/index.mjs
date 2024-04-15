import {
  StartDICOMImportJobCommand,
  MedicalImagingClient
} from "@aws-sdk/client-medical-imaging";

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

export const handler = async (event) => {
  const key = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;

  const lastSlashIndex = key.lastIndexOf("/");
  const inputFolder = key.substring(0, lastSlashIndex);

  console.log("Input folder:", `s3://${bucketName}/${inputFolder}/`);

  const importResponse = await startDicomImportJob(
    key,
    bucketName,
    `s3://${bucketName}/${inputFolder}/`
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify(importResponse)
  };
  return response;
};
