import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { S3Service } from '../../integrations/s3.service.js';

const MODULE_CONTENT_TYPES = [
  'video',
  'pdf',
  'document',
  'presentation',
  'text',
  'quiz',
] as const;

type ModuleContentType = (typeof MODULE_CONTENT_TYPES)[number];

type QuizQuestion = {
  id: string;
  type?: 'single';
  prompt: string;
  points?: number;
  options: Array<{ id: string; text: string }>;
  correctOptionId?: string;
};

type QuizMeta = {
  quiz?: {
    title?: string;
    instructions?: string;
    passingScore?: number;
    questions?: QuizQuestion[];
  };
};

const UPLOAD_TYPES: Record<string, { folder: string; extensions: string[]; mimeTypes: string[] }> = {
  video: {
    folder: 'modules',
    extensions: ['mp4', 'webm', 'mov', 'm4v'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'],
  },
  pdf: {
    folder: 'modules',
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
  },
  document: {
    folder: 'modules',
    extensions: ['doc', 'docx'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  presentation: {
    folder: 'modules',
    extensions: ['ppt', 'pptx'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  },
};

function extensionOf(filename: string) {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function assertContentType(value: string): asserts value is ModuleContentType {
  if (!MODULE_CONTENT_TYPES.includes(value as ModuleContentType)) {
    throw new BadRequestException('Unsupported module content type.');
  }
}

function sanitizeHtml(input?: string | null) {
  if (!input) return input;
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '')
    .replace(/<(?!\/?(p|br|h1|h2|h3|strong|b|em|i|u|ol|ul|li|a|blockquote|div|span|table|thead|tbody|tr|th|td|img)\b)[^>]*>/gi, '');
}

function sanitizeQuizForLearner(meta: unknown) {
  const quiz = (meta as QuizMeta | null)?.quiz;
  if (!quiz) return meta;
  return {
    quiz: {
      title: quiz.title ?? '',
      instructions: quiz.instructions ?? '',
      passingScore: quiz.passingScore ?? null,
      questions: (quiz.questions ?? []).map((q) => ({
        id: q.id,
        type: q.type ?? 'single',
        prompt: q.prompt,
        points: q.points ?? 1,
        options: (q.options ?? []).map((option) => ({
          id: option.id,
          text: option.text,
        })),
      })),
    },
  };
}

function sanitizeModuleForLearner(module: any) {
  return {
    id: module.id,
    courseId: module.courseId,
    title: module.title,
    order: module.order,
    contentType: module.contentType,
    contentUrl: null,
    contentBody: null,
    contentMeta:
      module.contentType === 'quiz'
        ? sanitizeQuizForLearner(module.contentMeta)
        : null,
    duration: module.durationMinutes,
    isPublished: module.isPublished,
  };
}

function toPrismaJson(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  return value as Prisma.InputJsonValue;
}

@Injectable()
export class ModuleServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async findAllForCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const modules = await this.prisma.module.findMany({
      where: { courseId, isPublished: true },
      orderBy: { order: 'asc' },
    });
    return modules.map(sanitizeModuleForLearner);
  }

  async findAllForCourseAdmin(courseId: string) {
    await this.ensureCourse(courseId);
    return this.prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(courseId: string, moduleId: string, userId?: string) {
    if (!userId) throw new ForbiddenException('Authentication is required.');
    await this.ensureApprovedEnrollment(userId, courseId);

    const module = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId, isPublished: true },
    });
    
    if (!module) {
      throw new NotFoundException(`Module not found`);
    }

    let secureContentUrl = module.contentUrl;
    
    // If we stored an S3 key, generate a short-lived URL for playable/downloadable content.
    if (
      ['video', 'pdf', 'document', 'presentation'].includes(module.contentType) &&
      module.contentUrl &&
      !module.contentUrl.startsWith('http')
    ) {
      secureContentUrl = await this.s3Service.generatePresignedGetUrl(module.contentUrl);
    }

    return {
      ...module,
      contentMeta:
        module.contentType === 'quiz'
          ? sanitizeQuizForLearner(module.contentMeta)
          : module.contentMeta,
      secureContentUrl,
    };
  }

  async create(courseId: string, data: { title: string; order: number; contentType: string; contentUrl?: string | null; contentBody?: string | null; contentMeta?: unknown; duration?: number | null; isPublished?: boolean }) {
    await this.ensureCourse(courseId);
    assertContentType(data.contentType);
    return this.prisma.module.create({
      data: {
        title: data.title,
        order: data.order,
        contentType: data.contentType,
        contentUrl: data.contentUrl,
        contentBody: data.contentType === 'text' ? sanitizeHtml(data.contentBody) : data.contentBody,
        contentMeta: toPrismaJson(data.contentMeta),
        durationMinutes: data.duration,
        isPublished: data.isPublished,
        courseId,
      },
    });
  }

  async update(courseId: string, moduleId: string, data: Partial<{ title: string; order: number; contentType: string; contentUrl: string | null; contentBody: string | null; contentMeta: unknown; duration: number | null; durationMinutes: number | null; isPublished: boolean }>) {
    const existing = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId },
    });
    if (!existing) throw new NotFoundException('Module not found');
    if (data.contentType) assertContentType(data.contentType);
    const nextType = data.contentType ?? existing.contentType;
    const { duration, ...rest } = data;
    const updateData: Prisma.ModuleUncheckedUpdateInput = {
      ...rest,
      ...(duration !== undefined && { durationMinutes: duration }),
      contentMeta: toPrismaJson(data.contentMeta),
      contentBody: nextType === 'text' ? sanitizeHtml(data.contentBody) : data.contentBody,
    };
    return this.prisma.module.update({
      where: { id: moduleId },
      data: updateData,
    });
  }

  async delete(courseId: string, moduleId: string) {
    const existing = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Module not found');
    return this.prisma.module.delete({
      where: { id: moduleId },
    });
  }

  async generateUploadUrl(contentType: string, filename: string) {
    const normalizedContentType = contentType.toLowerCase();
    const extension = extensionOf(filename);
    const config = Object.values(UPLOAD_TYPES).find(
      (entry) =>
        entry.extensions.includes(extension) &&
        entry.mimeTypes.includes(normalizedContentType),
    );

    if (!config) {
      throw new BadRequestException('Unsupported module upload type.');
    }

    return this.s3Service.generatePresignedUrl(contentType, filename, config.folder);
  }

  async markComplete(userId: string, courseId: string, moduleId: string) {
    await this.ensureApprovedEnrollment(userId, courseId);
    const module = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId, isPublished: true },
      select: { id: true },
    });
    if (!module) throw new NotFoundException('Module not found');

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

  async submitQuiz(
    courseId: string,
    moduleId: string,
    userId: string,
    answers: Record<string, string | string[]>,
  ) {
    await this.ensureApprovedEnrollment(userId, courseId);
    const module = await this.prisma.module.findFirst({
      where: { id: moduleId, courseId, contentType: 'quiz', isPublished: true },
    });
    if (!module) throw new NotFoundException('Quiz module not found');

    const quiz = (module.contentMeta as QuizMeta | null)?.quiz;
    const questions = quiz?.questions ?? [];
    const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 1), 0);
    let earnedPoints = 0;

    const questionResults = questions.map((q) => {
      const answer = answers[q.id];
      const selected = Array.isArray(answer) ? answer[0] : answer;
      const correct = selected === q.correctOptionId;
      const points = q.points ?? 1;
      if (correct) earnedPoints += points;
      return {
        questionId: q.id,
        correct,
        pointsEarned: correct ? points : 0,
        pointsPossible: points,
      };
    });

    await this.markComplete(userId, courseId, moduleId);

    return {
      score: earnedPoints,
      total: totalPoints,
      percent: totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0,
      passed:
        typeof quiz?.passingScore === 'number'
          ? totalPoints
            ? (earnedPoints / totalPoints) * 100 >= quiz.passingScore
            : false
          : null,
      questionResults,
    };
  }

  private async ensureCourse(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) throw new NotFoundException('Course not found.');
    return course;
  }

  private async ensureApprovedEnrollment(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { paymentStatus: true },
    });

    if (!enrollment || enrollment.paymentStatus !== 'approved') {
      throw new ForbiddenException('Approved enrollment is required to access this module.');
    }

    return enrollment;
  }
}
