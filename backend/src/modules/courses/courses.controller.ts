import { Controller, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';

// The @Controller('courses') decorator tells Nest that this class handles
// all requests that begin with "/courses" (e.g. GET /courses)
@Controller('courses')
export class CoursesController {
  // Dependency Injection: Nest automatically provides the CoursesService here
  constructor(private readonly coursesService: CoursesService) {}

  // The @Get() decorator binds this method to a GET request on "/courses"
  @Get()
  async getAllCourses(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAll(query);
  }
  @Get(':persona/:slug')
  async getCourseBySlug(
    @Param('persona') persona: string,
    @Param('slug') slug: string,
  ) {
    return this.coursesService.findOneBySlug(persona, slug);
  }
}
