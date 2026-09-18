import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName =
    process.env.S3_BUCKET_NAME || 'my-course-platform';
  private readonly region = process.env.S3_REGION || 'us-east-1';
  private readonly publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL ||
    `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;

  constructor() {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'fake-key',
        secretAccessKey: process.env.S3_SECRET_KEY || 'fake-secret',
      },
      // Disable automatic CRC32 checksums — they break browser-side presigned PUT uploads
      requestChecksumCalculation: 'WHEN_REQUIRED',
      // endpoint: 'https://sfo3.digitaloceanspaces.com', // Uncomment if using DigitalOcean
    });
  }

  async generatePresignedUrl(
    contentType: string,
    originalFileName: string,
    folder = 'courses',
  ) {
    const extension = originalFileName.split('.').pop()?.toLowerCase() || 'bin';
    const uniqueFileName = `${uuidv4()}.${extension}`;
    const key = `uploads/${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
      // Prevent checksum headers from being included in the signed URL
      unhoistableHeaders: new Set([
        'x-amz-checksum-crc32',
        'x-amz-sdk-checksum-algorithm',
      ]),
    });
    return {
      uploadUrl,
      finalUrl: `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`,
    };
  }
}
