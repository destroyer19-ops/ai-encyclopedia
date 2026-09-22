import { Module } from '@nestjs/common';
import { EducatorController } from './educator.controller.js';
import { EducatorService } from './educator.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { S3Service } from '../../integrations/s3.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [EducatorController],
  providers: [EducatorService, S3Service],
})
export class EducatorModule {}
