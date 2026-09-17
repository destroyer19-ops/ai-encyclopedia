import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';

const course = {
  id: 'course-1',
  title: 'AI for Business Applications',
  slug: 'ai-for-business-applications',
  persona: 'Youth',
};

describe('EnrollmentsService', () => {
  function createService(overrides: Record<string, unknown> = {}) {
    const prisma = {
      enrollment: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({
          id: 'enrollment-1',
          userId: 'user-1',
          courseId: course.id,
          paymentStatus: 'unpaid',
          paymentProofUrl: null,
          progressPct: 0,
          startedAt: new Date('2026-01-01T00:00:00.000Z'),
          course,
        }),
      },
      course: {
        findFirst: vi.fn().mockResolvedValue(course),
      },
      ...overrides,
    };

    return {
      prisma,
      service: new EnrollmentsService(prisma as never),
    };
  }

  it('returns an empty list when the user has no enrollments', async () => {
    const { prisma, service } = createService();

    await expect(service.getMyEnrollments('user-1')).resolves.toEqual([]);
    expect(prisma.enrollment.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      include: {
        course: { select: { id: true, title: true, slug: true, persona: true } },
      },
    });
  });

  it('reports not enrolled for a valid course with no enrollment', async () => {
    const { service } = createService();

    await expect(
      service.getEnrollmentBySlug('user-1', 'ai-for-business-applications'),
    ).resolves.toEqual({
      enrolled: false,
      enrollment: null,
      course,
    });
  });

  it('throws not found for an invalid course slug', async () => {
    const { service } = createService({
      course: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    });

    await expect(service.getEnrollmentBySlug('user-1', 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('does not create a duplicate enrollment', async () => {
    const existingEnrollment = {
      id: 'enrollment-1',
      userId: 'user-1',
      courseId: course.id,
      course,
    };
    const { prisma, service } = createService({
      enrollment: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(existingEnrollment),
        create: vi.fn(),
      },
    });

    await expect(
      service.enrollBySlug('user-1', 'ai-for-business-applications'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.enrollment.create).not.toHaveBeenCalled();
  });
});
