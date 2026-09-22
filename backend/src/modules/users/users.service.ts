import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async updateProfile(userId: string, data: UpdateProfileDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.birthYear !== undefined && { birthYear: data.birthYear }),
        ...(data.nationality !== undefined && { nationality: data.nationality }),
        ...(data.persona !== undefined && { persona: data.persona }),
        ...(data.employmentStatus !== undefined && {
          employmentStatus: data.employmentStatus,
        }),
      },
    });

    await this.prisma.profile.upsert({
      where: { id: userId },
      update: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.locale !== undefined && { locale: data.locale }),
      },
      create: {
        id: userId,
        email: (await this.prisma.user.findUniqueOrThrow({ where: { id: userId } })).email,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        theme: data.theme ?? 'system',
        locale: data.locale ?? 'en',
      },
    });

    return this.getProfile(userId);
  }
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
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
    if (!user) return null;

    const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
    return {
      ...user,
      first_name: profile?.firstName ?? '',
      last_name: profile?.lastName ?? '',
      country: profile?.country ?? user.nationality ?? '',
      phone: profile?.phone ?? '',
      avatar_url: profile?.avatarUrl ?? '',
      theme: profile?.theme ?? 'system',
      locale: profile?.locale ?? 'en',
    };
  }

  async getPayments(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return payments.map((payment) => ({
      id: payment.id,
      reference: payment.reference,
      status: payment.status,
      amount_kobo: payment.amountKobo,
      created_at: payment.createdAt,
      rejection_reason: payment.rejectionReason,
      course_id: payment.courseId,
    }));
  }
}
