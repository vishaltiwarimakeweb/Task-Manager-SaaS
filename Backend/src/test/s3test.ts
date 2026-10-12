import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws-s3.js";

const testS3 = async () => {
  try {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: "taskweb-attachments",
      }),
    );
    console.log("S3 connection successful");
    console.log("S3 Objects : ", response.Contents);
  } catch (error) {
    console.error("S3 connection failed ", error);
  }
};
testS3();
