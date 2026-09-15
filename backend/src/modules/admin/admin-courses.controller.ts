import {
  Body,
  Controller,
  Post,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
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
  @Post()
  async createCourse(@Body() body: CreateCourseDto) {
    return this.adminCourseServices.createCourse(body);
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
}
