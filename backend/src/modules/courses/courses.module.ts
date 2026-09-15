import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

// The @Module decorator groups our controller and service together
// into a single logical "block" that we can import into our main App.
@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
