import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { EnrollmentsController } from './enrollments.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PassportModule } from '@nestjs/passport';
import { S3Service } from '../../integrations/s3.service.js';

@Module({
  imports: [PrismaModule, PassportModule], // <-- Let's get it right this time! :)
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, S3Service],
})
export class EnrollmentsModule {}
