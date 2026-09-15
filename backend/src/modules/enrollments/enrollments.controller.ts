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

@Controller('enrollments')
@UseGuards(JwtAuthGuard) // MUST be logged in to track progress!
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  async getMyEnrollments(@Request() req: { user: any }) {
    return this.enrollmentsService.getMyEnrollments(req.user.userId);
  }

  @Post(':courseId')
  async enroll(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.enroll(req.user.userId, courseId);
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
}
