import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { EducatorService } from './educator.service.js';

@Controller('educator')
@UseGuards(JwtAuthGuard)
export class EducatorController {
  constructor(private readonly educatorService: EducatorService) {}

  @Get('overview')
  async getOverview(@Request() req: { user: any }) {
    return this.educatorService.getOverview(req.user.userId);
  }

  @Get('courses')
  async getCourses(@Request() req: { user: any }) {
    return this.educatorService.getCourses(req.user.userId);
  }

  @Get('ledger')
  async getLedger() {
    return this.educatorService.getLedger();
  }

  @Get('payouts')
  async getPayouts() {
    return this.educatorService.getPayouts();
  }

  @Post('payouts')
  async requestPayout(@Request() req: { user: any }, @Body() body: { amountKobo: number }) {
    return this.educatorService.requestPayout(req.user.userId, body.amountKobo);
  }

  @Get('application')
  async getApplication(@Request() req: { user: any }) {
    return this.educatorService.getApplication(req.user.userId);
  }

  @Post('application')
  async submitApplication(@Request() req: { user: any }, @Body() body: any) {
    return this.educatorService.submitApplication(req.user.userId, body);
  }

  @Post('courses/:courseId/submit')
  async submitCourse(@Param('courseId') courseId: string) {
    return this.educatorService.submitCourseForReview(courseId);
  }
}
