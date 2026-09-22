import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  Put,
  Delete,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { adminCourseServices } from './admin-courses.service.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCourseController {
  constructor(
    private readonly adminCourseServices: adminCourseServices,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getCourses() {
    return this.adminCourseServices.getCourses();
  }

  @Post()
  async createCourse(@Body() body: any) {
    return this.adminCourseServices.createCourse(body);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() body: any) {
    return this.adminCourseServices.updateCourse(id, body);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.adminCourseServices.deleteCourse(id);
  }

  @Post(':id/modules')
  async createModule(
    @Param('id') courseId: string,
    @Body() body: CreateModuleDto,
  ) {
    return this.adminCourseServices.createModule(courseId, body);
  }

  @Patch(':id/publish')
  async publishCourse(@Param('id') courseId: string) {
    return this.adminCourseServices.publishCourse(courseId);
  }

  @Post('media/presign')
  async presignMedia(
    @Body() body: { contentType: string; filename: string }
  ) {
    return this.adminCourseServices.presignMedia(body.contentType, body.filename);
  }

  @Post('modules/:moduleId/assignment')
  async upsertAssignment(
    @Param('moduleId') moduleId: string,
    @Body() body: any,
  ) {
    return this.adminCourseServices.upsertAssignment(moduleId, body);
  }

  @Get('modules/:moduleId/assignment')
  async getAssignment(@Param('moduleId') moduleId: string) {
    return this.adminCourseServices.getAssignment(moduleId);
  }

  @Get(':id/stats')
  async getCourseStatistics(@Param('id') courseId: string) {
    return this.adminCourseServices.getCourseStatistics(courseId);
  }

  @Get(':id/students')
  async getCourseStudents(@Param('id') courseId: string) {
    return this.adminCourseServices.getCourseStudents(courseId);
  }
}

// ---- A separate controller on the /admin prefix for overview + announcements ----

import { Controller as Ctrl2, Get as G2, Post as P2, Body as B2, UseGuards as UG2 } from '@nestjs/common';

@Ctrl2('admin/overview')
@UG2(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminOverviewController {
  constructor(private readonly prisma: PrismaService) {}

  @G2()
  async getOverview() {
    const [users, liveCourses, enrolments, pendingProofs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count({ where: { status: 'published' } }),
      this.prisma.enrollment.count(),
      this.prisma.enrollment.count({ where: { paymentStatus: 'under_review' } }),
    ]);
    return {
      users,
      students: users,
      educators: 0,
      live_courses: liveCourses,
      enrolments,
      gross_kobo: 0,
      platform_kobo: 0,
      owed_educators_kobo: 0,
      pending_applications: 0,
      pending_courses: 0,
      pending_proofs: pendingProofs,
      payouts_due_24h: 0,
      payouts_overdue: 0,
    };
  }
}

@Ctrl2('admin/announcements')
@UG2(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminAnnouncementsController {
  @G2()
  async listAnnouncements() {
    return [];
  }

  @P2()
  async sendAnnouncement(@B2() body: any) {
    console.log('[Announcements] stub - would send:', body);
    return { ok: true, recipients: 0 };
  }
}
