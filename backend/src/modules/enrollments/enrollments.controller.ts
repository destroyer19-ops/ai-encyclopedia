import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { SubmitPaymentDto } from './dto/submit-payment.dto.js';
import { PresignPaymentDto } from './dto/presign-payment.dto.js';
import { S3Service } from '../../integrations/s3.service.js';

@Controller('enrollments')
@UseGuards(JwtAuthGuard) // MUST be logged in to track progress!
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('payment-proof/presign')
  async getPaymentPresignedUrl(@Body() body: PresignPaymentDto) {
    return this.s3Service.generatePresignedUrl(body.contentType, body.filename, 'payments');
  }

  @Get()
  async getMyEnrollments(@Request() req: { user: any }) {
    return this.enrollmentsService.getMyEnrollments(req.user.userId);
  }

  @Get(':courseId')
  async getEnrollmentById(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.getEnrollmentById(req.user.userId, courseId);
  }

  @Post(':courseId')
  async enrollById(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: { method?: string },
  ) {
    return this.enrollmentsService.enrollById(req.user.userId, courseId, body?.method);
  }

  @Patch(':courseId/progress')
  async completeModule(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: UpdateProgressDto,
  ) {
    return this.enrollmentsService.completeModule(
      req.user.userId,
      courseId,
      body,
    );
  }

  @Post(':courseId/payment-proof')
  async submitPaymentProof(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: SubmitPaymentDto,
  ) {
    return this.enrollmentsService.submitPaymentProof(
      req.user.userId,
      courseId,
      body.paymentProofUrl,
    );
  }
}
