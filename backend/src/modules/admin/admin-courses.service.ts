import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { S3Service } from '../../integrations/s3.service.js';
import { CreateModuleDto } from './dto/create-module.dto.js';

@Injectable()
export class adminCourseServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  private normalizePublishFields(dto: any) {
    const next = { ...dto };

    if (typeof next.isPublished === 'boolean' && next.status === undefined) {
      next.status = next.isPublished ? 'published' : 'draft';
    }

    if (typeof next.status === 'string' && next.isPublished === undefined) {
      next.isPublished = next.status === 'published';
    }

    return next;
  }

  async createCourse(dto: any) {
    return this.prisma.course.create({ data: this.normalizePublishFields(dto) });
  }

  async updateCourse(id: string, dto: any) {
    return this.prisma.course.update({
      where: { id },
      data: this.normalizePublishFields(dto),
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
      data: {
        ...dto,
        contentMeta:
          dto.contentMeta === undefined
            ? undefined
            : (dto.contentMeta as Prisma.InputJsonValue),
        courseId,
      },
    });
  }

  async publishCourse(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'published', isPublished: true },
    });
  }

  async presignMedia(contentType: string, filename: string) {
    return this.s3Service.generatePresignedUrl(contentType, filename, 'media');
  }
}
