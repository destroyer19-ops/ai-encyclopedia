import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminEnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingPayments() {
    return this.prisma.enrollment.findMany({
      where: { paymentStatus: 'under_review' },
      include: {
        user: { select: { id: true, email: true, persona: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { startedAt: 'asc' },
    });
  }

  async updatePaymentStatus(enrollmentId: string, status: 'approved' | 'rejected') {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { user: true, course: true },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const updated = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { paymentStatus: status },
    });

    if (status === 'approved') {
      // TODO: send confirmation email
      console.log(`Sending approval email to ${enrollment.user.email} for course ${enrollment.course.title}`);
    }

    return updated;
  }
}
