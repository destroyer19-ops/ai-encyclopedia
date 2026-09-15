import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: { select: { title: true, slug: true, persona: true } },
      },
    });
  }

  async enroll(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      throw new ConflictException('You are already enrolled in this course.');
    }
    return this.prisma.enrollment.create({
      data: { userId, courseId },
    });
  }

  async completeModule(
    userId: string,
    courseId: string,
    dto: UpdateProgressDto,
  ) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    // Upsert into the join table (safe to call multiple times for same module)
    await this.prisma.moduleCompletion.upsert({
      where: { userId_moduleId: { userId, moduleId: dto.moduleId } },
      create: { userId, moduleId: dto.moduleId },
      update: {},
    });

    // Recalculate progress
    const [completedCount, totalModules] = await Promise.all([
      this.prisma.moduleCompletion.count({
        where: { userId, module: { courseId } },
      }),
      this.prisma.module.count({ where: { courseId } }),
    ]);

    const progressPct = Math.round(
      (completedCount / (totalModules || 1)) * 100,
    );
    const isFinished = progressPct >= 100;

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPct,
        completedAt: isFinished ? new Date() : null,
      },
    });
  }
}
