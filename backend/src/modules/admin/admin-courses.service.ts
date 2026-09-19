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

  async upsertAssignment(moduleId: string, dto: any) {
    return this.prisma.assignment.upsert({
      where: { moduleId },
      update: {
        title: dto.title,
        description: dto.description,
        attachmentUrl: dto.attachmentUrl,
        submissionType: dto.submissionType,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        maxScore: dto.maxScore,
        passMark: dto.passMark,
        isRequired: dto.isRequired,
        isEnabled: dto.isEnabled,
      },
      create: {
        moduleId,
        title: dto.title,
        description: dto.description,
        attachmentUrl: dto.attachmentUrl,
        submissionType: dto.submissionType || 'text',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        maxScore: dto.maxScore,
        passMark: dto.passMark,
        isRequired: dto.isRequired || false,
        isEnabled: dto.isEnabled ?? true,
      }
    });
  }

  async getAssignment(moduleId: string) {
    return this.prisma.assignment.findUnique({
      where: { moduleId }
    });
  }

  async getCourseStatistics(courseId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
    });

    const totalLearners = enrollments.length;
    const paidLearners = enrollments.filter(e => e.paymentStatus === 'approved').length;
    const startedLearners = enrollments.filter(e => e.progressPct > 0).length;
    const completedLearners = enrollments.filter(e => e.progressPct === 100).length;
    
    const course = await this.prisma.course.findUnique({ where: { id: courseId }});
    const price = course?.price || 0;
    const revenue = paidLearners * price;

    return {
      totalLearners,
      paidLearners,
      startedLearners,
      completedLearners,
      completionRate: totalLearners > 0 ? (completedLearners / totalLearners) * 100 : 0,
      revenue
    };
  }

  async getCourseStudents(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    });
  }
}
