import { Injectable } from '@nestjs/common';
import { S3Service } from '../../integrations/s3.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';

@Injectable()
export class AdminUploadsService {
  constructor(private readonly s3Service: S3Service) {}
  async getPresignedUrl(dto: PresignUploadDto) {
    return this.s3Service.generatePresignedUrl(dto.contentType, dto.filename);
  }
}
