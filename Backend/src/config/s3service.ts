import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws-s3.js";

export const uploadFileToS3 = async (
  key: string,
  buffer: Buffer,
  contentType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: "taskweb-attachments",
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  return await s3Client.send(command);
};
