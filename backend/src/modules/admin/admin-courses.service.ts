import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateModuleDto } from './dto/create-module.dto.js';

@Injectable()
export class adminCourseServices {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(dto: any) {
    return this.prisma.course.create({ data: dto });
  }

  async updateCourse(id: string, dto: any) {
    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  async getCourses() {
    return this.prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createModule(courseId: string, dto: CreateModuleDto) {
    return this.prisma.module.create({
      data: { ...dto, courseId },
    });
  }

  async publishCourse(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'published', isPublished: true },
    });
  }
}
