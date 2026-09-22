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

    if (next.summary !== undefined && next.description === undefined) {
      next.description = next.summary;
    }
    if (next.image_url !== undefined && next.imageUrl === undefined) {
      next.imageUrl = next.image_url;
    }
    if (next.sort_order !== undefined && next.sortOrder === undefined) {
      next.sortOrder = Number(next.sort_order ?? 0);
    }
    if (next.published !== undefined && next.isPublished === undefined) {
      next.isPublished = Boolean(next.published);
    }
    if (next.published !== undefined && next.status === undefined) {
      next.status = next.published ? 'published' : 'draft';
    }
    if (next.level !== undefined) {
      delete next.level;
    }

    // Map new frontend snake_case fields to Prisma camelCase fields
    if (next.course_level !== undefined) next.courseLevel = next.course_level;
    if (next.language !== undefined) next.language = next.language;
    if (next.delivery !== undefined) next.delivery = next.delivery;
    if (next.duration_hours !== undefined) next.durationHours = Number(next.duration_hours);
    if (next.pass_mark !== undefined) next.passMark = Number(next.pass_mark);
    if (next.sequential_modules !== undefined) next.sequentialModules = Boolean(next.sequential_modules);
    if (next.require_assessment !== undefined) next.requireAssessment = Boolean(next.require_assessment);
    if (next.educator_id !== undefined) next.educatorId = next.educator_id;
    if (next.author_name !== undefined) next.authorName = next.author_name;
    if (next.author_avatar_url !== undefined) next.authorAvatarUrl = next.author_avatar_url;
    if (next.rejection_reason !== undefined) next.rejectionReason = next.rejection_reason;

    // Delete snake_case keys so they don't break Prisma
    delete next.summary;
    delete next.image_url;
    delete next.sort_order;
    delete next.published;
    delete next.sequential_modules;
    delete next.require_assessment;
    delete next.course_level;
    delete next.duration_hours;
    delete next.pass_mark;
    delete next.educator_id;
    delete next.author_name;
    delete next.author_avatar_url;
    delete next.rejection_reason;

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
    const rows = await this.prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((course) => ({
      ...course,
      summary: course.description,
      image_url: course.imageUrl,
      published: course.status === 'published' || course.isPublished,
      sort_order: course.sortOrder,
      sequential_modules: course.sequentialModules ?? true,
      require_assessment: course.requireAssessment ?? false,
      course_level: course.courseLevel,
      delivery: course.delivery,
      duration_hours: course.durationHours,
      pass_mark: course.passMark,
      educator_id: course.educatorId,
      author_name: course.authorName,
      author_avatar_url: course.authorAvatarUrl,
      rejection_reason: course.rejectionReason,
    }));
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
