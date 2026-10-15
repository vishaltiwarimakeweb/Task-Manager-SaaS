import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./aws-s3.js";
import type { ObjectId } from "mongoose";

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

export const listAllS3Objects = async (taskId: string | ObjectId) => {
  const BUCKET_NAME = "taskweb-attachments";
  const prefix = `tasks/${taskId}`;
  const objects = [];
  let continuationString: string | undefined;
  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        ContinuationToken: continuationString,
        Prefix: prefix,
      }),
    );
    objects.push(...(response.Contents || []));
    continuationString = response.ContinuationToken;
  } while (continuationString);

  return objects.map((object) => ({
    key: object.Key,
    size: object.Size,
    lastModified: object.LastModified,
    eTag: object.ETag,
  }));
};

export const getS3Object = async (key: string) => {
  const BUCKET_NAME = "taskweb-attachments";
  return await s3Client.send(
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
};

export const deleteS3Object = async (key: string) => {
  const BUCKET_NAME = "taskweb-attachments";
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
};
