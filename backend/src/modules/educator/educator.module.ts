import { Module } from '@nestjs/common';
import { EducatorController } from './educator.controller.js';
import { EducatorService } from './educator.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [EducatorController],
  providers: [EducatorService],
})
export class EducatorModule {}
