import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { TrainingsController } from './trainings.controller.js';
import { TrainingsService } from './trainings.service.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TrainingsController],
  providers: [TrainingsService],
})
export class TrainingsModule {}
