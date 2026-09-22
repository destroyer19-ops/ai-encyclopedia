import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
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
    return this.educatorService.getCourses(req.user.userId, req.user.role);
  }

  @Post('courses')
  async createCourse(@Request() req: { user: any }, @Body() body: any) {
    return this.educatorService.createCourse(req.user.userId, req.user.role, body);
  }

  @Put('courses/:courseId')
  async updateCourse(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: any,
  ) {
    return this.educatorService.updateCourse(req.user.userId, req.user.role, courseId, body);
  }

  @Get('courses/:courseId/modules')
  async getModules(@Request() req: { user: any }, @Param('courseId') courseId: string) {
    return this.educatorService.getModules(req.user.userId, req.user.role, courseId);
  }

  @Post('courses/:courseId/modules')
  async createModule(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: any,
  ) {
    return this.educatorService.createModule(req.user.userId, req.user.role, courseId, body);
  }

  @Put('courses/:courseId/modules/:moduleId')
  async updateModule(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() body: any,
  ) {
    return this.educatorService.updateModule(req.user.userId, req.user.role, courseId, moduleId, body);
  }

  @Delete('courses/:courseId/modules/:moduleId')
  async deleteModule(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.educatorService.deleteModule(req.user.userId, req.user.role, courseId, moduleId);
  }

  @Get('courses/:courseId/materials')
  async getMaterials(@Request() req: { user: any }, @Param('courseId') courseId: string) {
    return this.educatorService.getMaterials(req.user.userId, req.user.role, courseId);
  }

  @Post('courses/:courseId/materials')
  async createMaterial(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: any,
  ) {
    return this.educatorService.createMaterial(req.user.userId, req.user.role, courseId, body);
  }

  @Put('courses/:courseId/materials/:materialId')
  async updateMaterial(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
    @Body() body: any,
  ) {
    return this.educatorService.updateMaterial(req.user.userId, req.user.role, courseId, materialId, body);
  }

  @Delete('courses/:courseId/materials/:materialId')
  async deleteMaterial(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.educatorService.deleteMaterial(req.user.userId, req.user.role, courseId, materialId);
  }

  @Get('courses/:courseId/announcements')
  async getAnnouncements(@Request() req: { user: any }, @Param('courseId') courseId: string) {
    return this.educatorService.getAnnouncements(req.user.userId, req.user.role, courseId);
  }

  @Post('courses/:courseId/announcements')
  async createAnnouncement(
    @Request() req: { user: any },
    @Param('courseId') courseId: string,
    @Body() body: any,
  ) {
    return this.educatorService.createAnnouncement(req.user.userId, req.user.role, courseId, body);
  }

  @Post('uploads/presign')
  async presignUpload(
    @Request() req: { user: any },
    @Body() body: { contentType: string; filename: string },
  ) {
    return this.educatorService.presignUpload(req.user.userId, req.user.role, body.contentType, body.filename);
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
  async submitCourse(@Request() req: { user: any }, @Param('courseId') courseId: string) {
    return this.educatorService.submitCourseForReview(req.user.userId, req.user.role, courseId);
  }
}
