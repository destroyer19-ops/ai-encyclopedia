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
} from '@nestjs/common';
import { adminCourseServices } from './admin-courses.service.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCourseController {
  constructor(private readonly adminCourseServices: adminCourseServices) {}

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
}
