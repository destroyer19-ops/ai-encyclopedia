import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export type PendingProof = {
  id: string;
  reference: string;
  payer_name: string;
  proof_note: string;
  proof_path: string;
  amount_kobo: number;
  created_at: string;
  course_title: string;
  student_name: string;
  student_email: string;
  proof_url: string;
};

@Injectable()
export class AdminEnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Full enrollment list (admin table view). */
  async listEnrollments() {
    return this.prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, email: true, persona: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 500,
    });
  }

  /**
   * Returns enrollments whose paymentStatus is 'under_review',
   * shaped as PendingProof so the frontend payments-admin component
   * can render them without modification.
   */
  async getPendingPayments(): Promise<PendingProof[]> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { paymentStatus: 'under_review' },
      include: {
        user: { select: { id: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolledAt: 'asc' },
    });

    // Fetch profiles separately since Profile has no FK relation on User in Prisma schema
    const out: PendingProof[] = await Promise.all(
      enrollments.map(async (enrollment) => {
        const profile = await this.prisma.profile.findUnique({
          where: { id: enrollment.userId },
          select: { firstName: true, lastName: true },
        });

        const firstName = profile?.firstName ?? '';
        const lastName = profile?.lastName ?? '';
        const studentName = [firstName, lastName].filter(Boolean).join(' ') || '';

        // paymentProofUrl may be an S3 key or a full URL
        const proofUrl = enrollment.paymentProofUrl ?? '';

        return {
          id: enrollment.id,
          reference: enrollment.id, // enrollment ID serves as reference
          payer_name: studentName,
          proof_note: '',
          proof_path: proofUrl,
          amount_kobo: enrollment.course?.price
            ? Number((enrollment.course as any).price) * 100
            : 0,
          created_at: enrollment.createdAt.toISOString(),
          course_title: enrollment.course?.title ?? '',
          student_name: studentName,
          student_email: enrollment.user?.email ?? '',
          // If it is a full URL expose it directly; otherwise treat it as an S3 key path.
          proof_url: proofUrl.startsWith('http') ? proofUrl : proofUrl,
        };
      }),
    );

    return out;
  }

  /**
   * Update the raw paymentStatus field.
   * Used by the legacy /payment-status endpoint.
   */
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
      console.log(
        `[Admin] Approved payment for ${enrollment.user.email} — course: ${enrollment.course.title}`,
      );
    }

    return updated;
  }

  /**
   * Approve or reject a payment proof.
   * On approval: paymentStatus → 'approved'.
   * On rejection: paymentStatus → 'rejected', rejectionReason stored.
   *
   * This is the endpoint the payments-admin component uses when the admin
   * clicks "Approve and enrol" or "Decline".
   */
  async reviewPaymentProof(enrollmentId: string, approve: boolean, reason: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { user: true, course: true },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (approve) {
      await this.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          paymentStatus: 'approved',
          status: 'active',
          rejectionReason: null,
        },
      });
      console.log(
        `[Admin] Payment proof approved for ${enrollment.user.email} — course: ${enrollment.course.title}`,
      );
    } else {
      await this.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          paymentStatus: 'rejected',
          rejectionReason: reason || 'We could not match this transfer.',
        },
      });
      console.log(
        `[Admin] Payment proof rejected for ${enrollment.user.email} — reason: ${reason}`,
      );
    }

    return { ok: true };
  }
}
