import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMyEnrollments(userId: string) {
    if (!userId) return [];

    try {
      return await this.prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: { select: { id: true, title: true, slug: true, persona: true, price: true } },
        },
      });
    } catch (error) {
      this.logUnexpectedError(
        `Failed to load enrollments for user ${userId}. Error: ${error}`,
        error,
      );
      throw new InternalServerErrorException(
        'Unable to load enrollments. Please try again.',
      );
    }
  }

  async getEnrollmentBySlug(userId: string, courseSlug: string) {
    let course: {
      id: string;
      title: string;
      slug: string;
      persona: string;
    } | null;

    try {
      course = await this.prisma.course.findFirst({
        where: { slug: courseSlug, status: 'published' },
        select: { id: true, title: true, slug: true, persona: true },
      });
    } catch (error) {
      this.logUnexpectedError(
        `Failed to find course for slug ${courseSlug}`,
        error,
      );
      throw new InternalServerErrorException(
        'Unable to load enrollment status. Please try again.',
      );
    }

    if (!course) {
      this.logger.warn(`getEnrollmentBySlug: Course not found in DB for slug '${courseSlug}'. Make sure the seed script was run on the production database.`);
      throw new NotFoundException('Course not found.');
    }

    let enrollment;
    try {
      enrollment = await this.prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
        include: {
          course: { select: { id: true, title: true, slug: true, persona: true, price: true } },
        },
      });
    } catch (error) {
      this.logUnexpectedError(
        `Failed to load enrollment for user ${userId} and course ${course.id}`,
        error,
      );
      throw new InternalServerErrorException(
        'Unable to load enrollment status. Please try again.',
      );
    }

    return {
      enrolled: Boolean(enrollment),
      enrollment,
      course,
    };
  }

  async enrollBySlug(userId: string, courseSlug: string) {
    const { enrolled, course } = await this.getEnrollmentBySlug(
      userId,
      courseSlug,
    );

    if (enrolled) {
      throw new ConflictException('You are already enrolled in this course.');
    }

    try {
      return await this.prisma.enrollment.create({
        data: { userId, courseId: course.id },
        include: {
          course: { select: { id: true, title: true, slug: true, persona: true, price: true } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You are already enrolled in this course.');
      }

      this.logUnexpectedError(
        `Failed to create enrollment for user ${userId} and course ${course.id}`,
        error,
      );

      throw new InternalServerErrorException(
        'Unable to complete enrollment. Please try again.',
      );
    }
  }

  async getEnrollmentById(userId: string, courseId: string) {
    let course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, slug: true, persona: true, price: true },
    });
    if (!course) throw new NotFoundException('Course not found.');

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: { select: { id: true, title: true, slug: true, persona: true, price: true } },
      },
    });

    return {
      enrolled: Boolean(enrollment),
      enrollment,
      course,
    };
  }

  async enrollById(userId: string, courseId: string, method?: string) {
    const { enrolled, course } = await this.getEnrollmentById(userId, courseId);
    if (enrolled) return { kind: 'enrolled' };

    try {
      const price = course.price ?? 0;
      const isFree = price <= 0;

      const enrollment = await this.prisma.enrollment.create({
        data: {
          userId,
          courseId: course.id,
          status: isFree ? 'active' : 'pending',
          paymentStatus: isFree ? 'none' : 'pending',
        },
      });

      if (isFree) {
        return { kind: 'enrolled' };
      }

      const amountKobo = price * 1500; // Hardcoded mock rate like frontend
      
      if (method === 'bank_transfer') {
        return {
          kind: 'bank_transfer',
          reference: enrollment.id,
          amountKobo,
          bank: {
            enabled: true,
            bank_name: 'Mock Bank',
            account_name: 'AI Encyclovia',
            account_number: '0000000000',
            instructions: 'Transfer to this account',
          },
        };
      }

      // If method === 'paystack', we would normally call Paystack API here
      // For now, return a checkout kind with a dummy URL that redirects to callback
      return {
        kind: 'checkout',
        reference: enrollment.id,
        url: `https://checkout.paystack.com/dummy`, // In real app, initialize paystack transaction here
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('You are already enrolled in this course.');
      }
      this.logUnexpectedError(`Failed to create enrollment`, error);
      throw new InternalServerErrorException('Unable to complete enrollment. Please try again.');
    }
  }

  private logUnexpectedError(message: string, error: unknown) {
    this.logger.error(
      message,
      error instanceof Error ? error.stack : String(error),
    );
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

  async submitPaymentProof(userId: string, courseId: string, paymentProofUrl: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        paymentStatus: 'under_review',
        paymentProofUrl,
      },
    });
  }
}
