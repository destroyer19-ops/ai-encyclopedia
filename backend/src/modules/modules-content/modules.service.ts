import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ModuleServices {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(courseId: string, moduleId: string) {
    const module = await this.prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId: courseId,
      },
    });
    if (!module) {
      throw new NotFoundException(
        `Module not found for ${courseId} under ${moduleId}`,
      );
    }
    return module;
  }
}
