import { Module } from '@nestjs/common';
import { ModuleController } from './modules.controller.js';
import { ModuleServices } from './modules.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ModuleController],
  providers: [ModuleServices],
})
export class ModulesModule {}
