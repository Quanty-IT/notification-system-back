import { randomUUID } from 'node:crypto';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DownloadFileOutput, FileStorage, UploadFileInput, UploadFileOutput } from '../domain/file-storage';

const getS3Client = (): S3Client => {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });
};

export class R2FileStorage implements FileStorage {
  async upload(input: UploadFileInput): Promise<UploadFileOutput> {
    const s3Client = getS3Client();

    const storageKey = `communications/${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: storageKey,
      Body: input.content,
      ContentType: input.mimeType,
    });

    try {
      await s3Client.send(command);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to upload file to Cloudflare R2: ${message}`);
    }

    return {
      storageProvider: 'r2',
      storageKey,
    };
  }

  async download(storageKey: string): Promise<DownloadFileOutput> {
    const s3Client = getS3Client();

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: storageKey,
    });

    try {
      const response = await s3Client.send(command);
      if (!response.Body) throw new Error('File body is empty');

      const byteArray = await response.Body.transformToByteArray();

      return {
        content: Buffer.from(byteArray),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to download file from Cloudflare R2: ${message}`);
    }
  }

  async delete(storageKey: string): Promise<void> {
    const s3Client = getS3Client();

    const command = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: storageKey,
    });

    try {
      await s3Client.send(command);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete file from Cloudflare R2: ${message}`);
    }
  }
}
