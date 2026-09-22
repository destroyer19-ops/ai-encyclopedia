import { PrismaModule } from '../../prisma/prisma.module.js';
import { AdminCourseController, AdminOverviewController, AdminAnnouncementsController } from './admin-courses.controller.js';
import { adminCourseServices } from './admin-courses.service.js';
import { Module } from '@nestjs/common';
import { AdminUploadsController } from './admin-uploads.controller.js';
import { AdminUploadsService } from './admin-uploads.service.js';
import { S3Service } from '../../integrations/s3.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { PassportModule } from '@nestjs/passport';
import { AdminEnrollmentsController } from './admin-enrollments.controller.js';
import { AdminEnrollmentsService } from './admin-enrollments.service.js';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminUsersService } from './admin-users.service.js';

@Module({
  imports: [PrismaModule, AuthModule, PassportModule],
  controllers: [
    AdminCourseController,
    AdminOverviewController,
    AdminAnnouncementsController,
    AdminUploadsController,
    AdminEnrollmentsController,
    AdminUsersController,
  ],
  providers: [adminCourseServices, AdminUploadsService, S3Service, AdminEnrollmentsService, AdminUsersService],
})
export class AdminModule {}
