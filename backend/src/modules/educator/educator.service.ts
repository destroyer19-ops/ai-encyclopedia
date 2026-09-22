import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class EducatorService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const userCourses = await this.prisma.course.findMany({
      where: { educatorId: userId },
      include: {
        enrollments: { select: { progressPct: true, completedAt: true } },
      },
    });

    const coursesCount = userCourses.length;
    const published = userCourses.filter((c) => c.status === 'published' || c.isPublished).length;
    
    let active = 0;
    let completed = 0;
    
    for (const c of userCourses) {
      for (const e of c.enrollments) {
        if (e.completedAt) completed++;
        else if (e.progressPct > 0) active++;
      }
    }

    return {
      overview: {
        courses: coursesCount,
        published,
        students: active + completed,
        active,
        completed,
        revenue: 0,
      },
      balance: {
        total: 0,
        pending: 0,
        available: 0,
        reserved: 0,
        paid: 0,
      },
    };
  }

  async getCourses(userId: string) {
    const rows = await this.prisma.course.findMany({
      where: { educatorId: userId },
      include: { modules: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    
    return rows.map(c => ({
      ...c,
      summary: c.description,
      image_url: c.imageUrl,
      published: c.status === 'published' || c.isPublished,
      sort_order: c.sortOrder,
      course_level: c.courseLevel,
      delivery: c.delivery,
      duration_hours: c.durationHours,
      pass_mark: c.passMark,
      sequential_modules: c.sequentialModules ?? true,
      require_assessment: c.requireAssessment ?? true,
      educator_id: c.educatorId,
      author_name: c.authorName,
      author_avatar_url: c.authorAvatarUrl,
      rejection_reason: c.rejectionReason,
    }));
  }

  async getLedger() {
    return [];
  }

  async getPayouts() {
    return [];
  }

  async requestPayout(userId: string, amountKobo: number) {
    console.log(`[Educator] Payout request from ${userId} for ${amountKobo} kobo (stub)`);
    return { ok: true };
  }

  async getApplication(userId: string) {
    return null;
  }

  async submitApplication(userId: string, data: any) {
    console.log(`[Educator] Application from ${userId}:`, data);
    return { ok: true };
  }

  async submitCourseForReview(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'pending_review' },
    });
  }
}
