import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

@Injectable()
export class S3Service {
  private readonly client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? "",
      secretAccessKey: process.env.S3_SECRET_KEY ?? ""
    },
    forcePathStyle: true
  });

  async createUploadUrl(keyPrefix: string, contentType: string) {
    const storageKey = `${keyPrefix}/${randomUUID()}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: storageKey,
      ContentType: contentType
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 60 * 10 });
    return { url, storageKey };
  }
}
