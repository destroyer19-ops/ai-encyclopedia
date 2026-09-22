import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: {
        _count: { select: { enrollments: true } },
      },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      first_name: '',
      last_name: '',
      country: u.nationality ?? '',
      phone: '',
      created_at: u.createdAt,
      suspended: u.role === 'suspended',
      roles: [u.role],
      enrolments: u._count.enrollments,
      paid_kobo: 0,
    }));
  }

  async setRole(userId: string, role: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { role } });
    return { ok: true };
  }

  async setSuspended(userId: string, suspend: boolean) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: suspend ? 'suspended' : 'learner' },
    });
    return { ok: true };
  }
}
