import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';

@Injectable()
export class CoursesService {
  // Dependency Injection: Nest automatically provides the PrismaService here
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCoursesDto) {
    // The instructions mentioned it's a read-only route.
    // In our backend-structure.md, it notes that the public /courses endpoint
    // should only return "published" courses, not drafts!
    return this.prisma.course.findMany({
      where: {
        status: 'published',
        ...(query.persona && { persona: query.persona }),
        ...(query.category && { category: query.category }),
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, contentType: true },
        },
      },
      orderBy: { title: 'asc' },
    });
  }
  async findOne(persona: string, slug: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        persona_slug: {
          persona: persona,
          slug: slug,
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course not found for ${persona}/${slug}`);
    }
    return course;
  }
  async findOneBySlug(persona: string, slug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        persona,
        slug,
        status: 'published',
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found or is not published yet');
    }

    return course;
  }
}
