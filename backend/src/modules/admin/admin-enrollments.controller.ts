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

  @Get('payments/pending')
  async getPendingPayments() {
    return this.enrollmentsService.getPendingPayments();
  }

  @Patch(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.enrollmentsService.updatePaymentStatus(id, body.status);
  }
}
