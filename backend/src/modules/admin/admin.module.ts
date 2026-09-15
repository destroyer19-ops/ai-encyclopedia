import { PrismaModule } from '../../prisma/prisma.module.js';
import { AdminCourseController } from './admin-courses.controller.js';
import { adminCourseServices } from './admin-courses.service.js';
import { Module } from '@nestjs/common';
import { AdminUploadsController } from './admin-uploads.controller.js';
import { AdminUploadsService } from './admin-uploads.service.js';
import { S3Service } from '../../integrations/s3.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminCourseController, AdminUploadsController],
  providers: [adminCourseServices, AdminUploadsService, S3Service],
})
export class AdminModule {}
