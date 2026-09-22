import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: data.gender,
        birthYear: data.birthYear,
        nationality: data.nationality,
        persona: data.persona,
        employmentStatus: data.employmentStatus,
      },
    });
  }
  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        gender: true,
        birthYear: true,
        nationality: true,
        persona: true,
        employmentStatus: true,
        role: true,
      },
    });
  }

  async getPayments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, paymentStatus: { not: 'unpaid' } },
      include: { course: true },
      orderBy: { startedAt: 'desc' },
      take: 20
    });
    return enrollments.map(e => ({
      id: e.id,
      reference: e.id,
      status: e.paymentStatus === 'under_review' ? 'pending' : e.paymentStatus,
      amount_kobo: (e.course?.price || 0) * 1500,
      created_at: e.startedAt,
      rejection_reason: null,
      course_id: e.courseId
    }));
  }
}
