import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { error } from "console";

export const region = "eu-central-1";
const client = new S3Client({ region });
export const bucket = "softycatbucket";

export const uploadToS3 = async (key: string, body: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });

  try {
    const response = await client.send(command);
    console.log(response);
    return response;
  } catch (err) {
    console.error(err);
    return error;
  }

  // const response = await client.send(command);

  // console.log(response);
};

export const deleteFromS3 = async (
  key: string
): Promise<DeleteObjectCommandOutput | null> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await client.send(command);
    console.log(response);
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};
