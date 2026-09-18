import { Controller, Param, Get, Post, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ModuleServices } from './modules.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@Controller('courses/:courseId/modules')
export class ModuleController {
  constructor(private readonly moduleServices: ModuleServices) {}

  @Public()
  @Get()
  async findAll(@Param('courseId') courseId: string) {
    return this.moduleServices.findAllForCourse(courseId);
  }

  // Learner fetches a module (requires authentication)
  @UseGuards(JwtAuthGuard)
  @Get(':moduleId')
  async findOne(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Request() req: any,
  ) {
    return this.moduleServices.findOne(courseId, moduleId, req.user?.id);
  }

  // Learner marks a module as complete
  @UseGuards(JwtAuthGuard)
  @Post(':moduleId/complete')
  async markComplete(
    @Param('moduleId') moduleId: string,
    @Request() req: any,
  ) {
    return this.moduleServices.markComplete(req.user.id, moduleId);
  }

  // ---- ADMIN ENDPOINTS ----

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('presign')
  async getPresignedUrl(@Body() body: { contentType: string; filename: string }) {
    return this.moduleServices.generateUploadUrl(body.contentType, body.filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() body: { title: string; order: number; contentType: string; contentUrl?: string; contentBody?: string },
  ) {
    return this.moduleServices.create(courseId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':moduleId')
  async update(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() body: Partial<{ title: string; order: number; contentType: string; contentUrl: string; contentBody: string }>,
  ) {
    return this.moduleServices.update(courseId, moduleId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':moduleId')
  async delete(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.moduleServices.delete(courseId, moduleId);
  }
}
