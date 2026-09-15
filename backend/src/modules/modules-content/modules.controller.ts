import { Controller, Param, Get } from '@nestjs/common';
import { ModuleServices } from './modules.service.js';

@Controller('courses/:courseId/modules')
export class ModuleController {
  constructor(private readonly moduleServices: ModuleServices) {}

  @Get(':moduleId')
  async findOne(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.moduleServices.findOne(courseId, moduleId);
  }
}
