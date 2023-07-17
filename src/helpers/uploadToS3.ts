import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const region = "eu-central-1";
const client = new S3Client({ region });
export const bucket = "softycatbucket";

export const uploadToS3 = async (key: string, body: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });

  const response = await client.send(command);

  console.log(response);
};
