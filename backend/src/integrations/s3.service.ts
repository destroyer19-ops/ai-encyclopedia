import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName = process.env.S3_BUCKET_NAME || 'my-course-platform';
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'fake-key',
        secretAccessKey: process.env.S3_SECRET_KEY || 'fake-secret',
      },
      // endpoint: 'https://sfo3.digitaloceanspaces.com', // Uncomment if using DigitalOcean
    });
  }
  async generatePresignedUrl(contentType: string, orginalFileName: string) {
    const extension = orginalFileName.split('.').pop();
    const uniqeFileName = `${uuidv4()}.${extension}`;
    const key = `uploads/courses/${uniqeFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 900,
    });
    return {
      uploadUrl,
      finalUrl: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
    };
  }
}
