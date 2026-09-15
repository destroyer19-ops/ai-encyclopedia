import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
@Injectable()
export class adminCourseServices {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto) {
    const createC = await this.prisma.course.create({ data: dto });

    return createC;
  }

  async createModule(courseId: string, dto: CreateModuleDto) {
    const createM = await this.prisma.module.create({
      data: { ...dto, courseId: courseId },
    });

    return createM;
  }
  async publishCourse(courseId: string) {
    const updateM = await this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'published' },
    });
    return updateM;
  }
}
