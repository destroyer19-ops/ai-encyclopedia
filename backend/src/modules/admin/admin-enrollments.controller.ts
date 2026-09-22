import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AdminEnrollmentsService } from './admin-enrollments.service.js';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto.js';

@Controller('admin/enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminEnrollmentsController {
  constructor(private readonly enrollmentsService: AdminEnrollmentsService) {}

  /** List all enrollments (for the admin enrollments table) */
  @Get()
  async listEnrollments() {
    return this.enrollmentsService.listEnrollments();
  }

  /** List pending payment proofs (bank transfers awaiting review) */
  @Get('payments/pending')
  async getPendingPayments() {
    return this.enrollmentsService.getPendingPayments();
  }

  /** PATCH /admin/enrollments/:id/payment-status — approve or reject */
  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.enrollmentsService.updatePaymentStatus(id, body.status);
  }

  /**
   * PATCH /admin/enrollments/:id/review
   * Approve or reject a payment proof submitted by a learner.
   * On approval the enrollment's paymentStatus is set to 'approved'.
   * On rejection the enrollment's paymentStatus is set to 'rejected' and
   * the rejection reason is stored.
   */
  @Patch(':id/review')
  async reviewPayment(
    @Param('id') id: string,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.enrollmentsService.reviewPaymentProof(
      id,
      body.approve,
      body.reason ?? '',
    );
  }

  /**
   * PATCH /admin/enrollments/:id — generic action handler
   * Supports action: 'approve' | 'reject' | 'activate' | 'deactivate'
   */
  @Patch(':id')
  async updateEnrollment(
    @Param('id') id: string,
    @Body() body: { action?: string; reason?: string; status?: string },
  ) {
    if (body.action === 'approve') {
      return this.enrollmentsService.reviewPaymentProof(id, true, '');
    }
    if (body.action === 'reject') {
      return this.enrollmentsService.reviewPaymentProof(id, false, body.reason ?? '');
    }
    if (body.status) {
      return this.enrollmentsService.updatePaymentStatus(id, body.status as 'approved' | 'rejected');
    }
    return { ok: true };
  }
}
