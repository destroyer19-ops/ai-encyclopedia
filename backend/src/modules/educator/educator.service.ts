import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { S3Service } from '../../integrations/s3.service.js';

@Injectable()
export class EducatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

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

  async getCourses(userId: string, role = 'learner') {
    this.assertEducator(role);
    const rows = await this.prisma.course.findMany({
      where: { educatorId: userId },
      include: { modules: { orderBy: { order: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    
    return rows.map((c) => this.mapCourse(c));
  }

  async createCourse(userId: string, role: string, body: any) {
    this.assertEducator(role);
    return this.mapCourse(
      await this.prisma.course.create({
        data: {
          description: '',
          ...this.normalizeCourse(body),
          educatorId: userId,
          status: 'draft',
          isPublished: false,
          persona: body.persona ?? 'educator',
        },
      }),
    );
  }

  async updateCourse(userId: string, role: string, courseId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    return this.mapCourse(
      await this.prisma.course.update({
        where: { id: courseId },
        data: this.normalizeCourse(body),
      }),
    );
  }

  async getModules(userId: string, role: string, courseId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    const rows = await this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
    return rows.map((m) => this.mapModule(m));
  }

  async createModule(userId: string, role: string, courseId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    const row = await this.prisma.module.create({
      data: {
        ...this.normalizeModule(body),
        title: body.title ?? 'New lesson',
        courseId,
      },
    });
    return this.mapModule(row);
  }

  async updateModule(userId: string, role: string, courseId: string, moduleId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    const existing = await this.prisma.module.findFirst({ where: { id: moduleId, courseId } });
    if (!existing) throw new NotFoundException('Module not found');
    const row = await this.prisma.module.update({
      where: { id: moduleId },
      data: this.normalizeModule(body),
    });
    return this.mapModule(row);
  }

  async deleteModule(userId: string, role: string, courseId: string, moduleId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    const existing = await this.prisma.module.findFirst({ where: { id: moduleId, courseId } });
    if (!existing) throw new NotFoundException('Module not found');
    await this.prisma.module.delete({ where: { id: moduleId } });
    return { ok: true };
  }

  async getMaterials(userId: string, role: string, courseId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    const rows = await this.prisma.courseMaterial.findMany({
      where: { courseId },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((m) => this.mapMaterial(m));
  }

  async createMaterial(userId: string, role: string, courseId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    const row = await this.prisma.courseMaterial.create({
      data: {
        ...this.normalizeMaterial(body),
        title: body.title ?? 'New material',
        courseId,
      },
    });
    return this.mapMaterial(row);
  }

  async updateMaterial(userId: string, role: string, courseId: string, materialId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    const existing = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, courseId },
    });
    if (!existing) throw new NotFoundException('Material not found');
    const row = await this.prisma.courseMaterial.update({
      where: { id: materialId },
      data: this.normalizeMaterial(body),
    });
    return this.mapMaterial(row);
  }

  async deleteMaterial(userId: string, role: string, courseId: string, materialId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    const existing = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, courseId },
    });
    if (!existing) throw new NotFoundException('Material not found');
    await this.prisma.courseMaterial.delete({ where: { id: materialId } });
    return { ok: true };
  }

  async getAnnouncements(userId: string, role: string, courseId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    return this.prisma.courseAnnouncement.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(userId: string, role: string, courseId: string, body: any) {
    await this.ensureOwnCourse(userId, role, courseId);
    return this.prisma.courseAnnouncement.create({
      data: {
        courseId,
        educatorId: userId,
        title: String(body.title ?? '').trim(),
        body: String(body.body ?? '').trim(),
      },
    });
  }

  async presignUpload(userId: string, role: string, contentType: string, filename: string) {
    this.assertEducator(role);
    return this.s3Service.generatePresignedUrl(contentType, filename, `educators/${userId}`);
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

  async submitCourseForReview(userId: string, role: string, courseId: string) {
    await this.ensureOwnCourse(userId, role, courseId);
    return this.mapCourse(await this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'pending_review' },
    }));
  }

  private assertEducator(role: string) {
    if (role !== 'educator' && role !== 'admin') {
      throw new ForbiddenException('Educator access is required.');
    }
  }

  private async ensureOwnCourse(userId: string, role: string, courseId: string) {
    this.assertEducator(role);
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (role !== 'admin' && course.educatorId !== userId) {
      throw new ForbiddenException('You can only manage your own courses.');
    }
    return course;
  }

  private normalizeCourse(body: any) {
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.summary !== undefined) data.description = body.summary;
    if (body.description !== undefined) data.description = body.description;
    if (body.overview !== undefined) data.overview = body.overview;
    if (body.image_url !== undefined) data.imageUrl = body.image_url;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.course_level !== undefined) data.courseLevel = body.course_level;
    if (body.courseLevel !== undefined) data.courseLevel = body.courseLevel;
    if (body.language !== undefined) data.language = body.language;
    if (body.delivery !== undefined) data.delivery = body.delivery;
    if (body.duration_hours !== undefined) data.durationHours = Number(body.duration_hours) || 0;
    if (body.durationHours !== undefined) data.durationHours = Number(body.durationHours) || 0;
    if (body.pass_mark !== undefined) data.passMark = Number(body.pass_mark) || 70;
    if (body.passMark !== undefined) data.passMark = Number(body.passMark) || 70;
    if (body.sequential_modules !== undefined) data.sequentialModules = Boolean(body.sequential_modules);
    if (body.sequentialModules !== undefined) data.sequentialModules = Boolean(body.sequentialModules);
    if (body.require_assessment !== undefined) data.requireAssessment = Boolean(body.require_assessment);
    if (body.requireAssessment !== undefined) data.requireAssessment = Boolean(body.requireAssessment);
    if (body.author_name !== undefined) data.authorName = body.author_name;
    if (body.authorName !== undefined) data.authorName = body.authorName;
    if (body.author_avatar_url !== undefined) data.authorAvatarUrl = body.author_avatar_url;
    if (body.authorAvatarUrl !== undefined) data.authorAvatarUrl = body.authorAvatarUrl;
    if (body.outcomes !== undefined) data.outcomes = body.outcomes;
    if (body.sessions !== undefined) data.sessions = body.sessions;
    if (body.country !== undefined) data.country = body.country;
    if (body.tier !== undefined) data.tier = body.tier;
    if (body.tone !== undefined) data.tone = body.tone;
    return data;
  }

  private normalizeModule(body: any) {
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.contentBody = body.content;
    if (body.contentBody !== undefined) data.contentBody = body.contentBody;
    if (body.content_type !== undefined) data.contentType = body.content_type;
    if (body.contentType !== undefined) data.contentType = body.contentType;
    if (body.duration_minutes !== undefined) data.durationMinutes = Number(body.duration_minutes) || 0;
    if (body.duration !== undefined) data.durationMinutes = Number(body.duration) || 0;
    if (body.sort_order !== undefined) data.order = Number(body.sort_order) || 0;
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.video_url !== undefined) data.videoUrl = body.video_url;
    if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
    if (body.file_url !== undefined) data.fileUrl = body.file_url;
    if (body.fileUrl !== undefined) data.fileUrl = body.fileUrl;
    const contentUrl = data.contentType === 'video' ? data.videoUrl : data.fileUrl;
    if (contentUrl !== undefined) data.contentUrl = contentUrl;
    if (body.contentUrl !== undefined) data.contentUrl = body.contentUrl;
    if (body.is_published !== undefined) data.isPublished = Boolean(body.is_published);
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (data.contentType === undefined && body.id === undefined) data.contentType = 'text';
    if (data.order === undefined && body.id === undefined) data.order = 1;
    return data;
  }

  private normalizeMaterial(body: any) {
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.file_url !== undefined) data.fileUrl = body.file_url;
    if (body.fileUrl !== undefined) data.fileUrl = body.fileUrl;
    if (body.file_type !== undefined) data.fileType = body.file_type;
    if (body.fileType !== undefined) data.fileType = body.fileType;
    if (body.sort_order !== undefined) data.sortOrder = Number(body.sort_order) || 0;
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
    return data;
  }

  private mapCourse(c: any) {
    return {
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
    };
  }

  private mapModule(m: any) {
    return {
      ...m,
      course_id: m.courseId,
      sort_order: m.order,
      content_type: m.contentType,
      content: m.contentBody,
      duration_minutes: m.durationMinutes,
      video_url: m.videoUrl ?? (m.contentType === 'video' ? m.contentUrl : ''),
      file_url: m.fileUrl ?? (m.contentType !== 'video' ? m.contentUrl : ''),
      is_published: m.isPublished,
    };
  }

  private mapMaterial(m: any) {
    return {
      ...m,
      course_id: m.courseId,
      file_url: m.fileUrl,
      file_type: m.fileType,
      sort_order: m.sortOrder,
      created_at: m.createdAt,
    };
  }
}
