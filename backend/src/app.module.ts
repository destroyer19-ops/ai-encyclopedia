import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CoursesModule } from './modules/courses/courses.module.js';
import { ModulesModule } from './modules/modules-content/modules.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module.js';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    ModulesModule,
    AdminModule,
    AuthModule,
    UsersModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
