import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { S3Service } from '../../integrations/s3.service.js';

@Injectable()
export class ModuleServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async findAllForCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(courseId: string, moduleId: string, userId?: string) {
    const module = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId },
    });
    
    if (!module) {
      throw new NotFoundException(`Module not found`);
    }

    // Verify user is enrolled and approved if a video is requested
    // (Assuming this check is done via AuthGuard in controller, but we can do extra checks here if needed)

    let secureContentUrl = module.contentUrl;
    
    // If it's a video and we stored the S3 key, generate a short-lived URL
    // We assume if contentUrl doesn't start with http, it's an S3 key
    if (module.contentType === 'video' && module.contentUrl && !module.contentUrl.startsWith('http')) {
      secureContentUrl = await this.s3Service.generatePresignedGetUrl(module.contentUrl);
    }

    return { ...module, secureContentUrl };
  }

  async create(courseId: string, data: { title: string; order: number; contentType: string; contentUrl?: string; contentBody?: string }) {
    return this.prisma.module.create({
      data: {
        ...data,
        courseId,
      },
    });
  }

  async update(courseId: string, moduleId: string, data: Partial<{ title: string; order: number; contentType: string; contentUrl: string; contentBody: string }>) {
    return this.prisma.module.update({
      where: { id: moduleId },
      data,
    });
  }

  async delete(courseId: string, moduleId: string) {
    return this.prisma.module.delete({
      where: { id: moduleId },
    });
  }

  async generateUploadUrl(contentType: string, filename: string) {
    // Generate a presigned PUT URL for uploading video content
    return this.s3Service.generatePresignedUrl(contentType, filename, 'modules');
  }

  async markComplete(userId: string, moduleId: string) {
    return this.prisma.moduleCompletion.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      update: {},
      create: {
        userId,
        moduleId,
      },
    });
  }
}
