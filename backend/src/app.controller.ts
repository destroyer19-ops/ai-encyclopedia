import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './common/decorators/public.decorator.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('contact')
  async submitContact(@Body() data: any) {
    // Assuming ContactMessage model exists, else we just log it or mock
    console.log("Contact message received:", data);
    return { success: true };
  }

  @Public()
  @Get('categories')
  getCategories() {
    return [
      { id: '01', name: 'Business', slug: 'business', icon: 'briefcase', sort_order: 1 },
      { id: '02', name: 'Content Creation', slug: 'content-creation', icon: 'sparkles', sort_order: 2 },
      { id: '03', name: 'Digital Publishing', slug: 'digital-publishing', icon: 'book-open', sort_order: 3 },
      { id: '04', name: 'AI Tools', slug: 'ai-tools', icon: 'bot', sort_order: 4 },
    ];
  }

  @Public()
  @Get('site-content')
  getSiteContent() {
    return {};
  }

  @Public()
  @Get('stats/platform')
  async getPlatformStats() {
    const [courses, learners, trainings] = await Promise.all([
      this.prisma.course.count({ where: { status: 'published' } }),
      this.prisma.user.count({ where: { role: 'learner' } }),
      this.prisma.training.count({ where: { published: true } }),
    ]);
    return {
      courses,
      educators: await this.prisma.user.count({ where: { role: 'educator' } }),
      learners,
      certificates: 0,
      trainings,
    };
  }

  @Public()
  @Get('stats/settings')
  getStatSettings() {
    return { minThreshold: 50 };
  }

  @Public()
  @Get('training-forms/:slug')
  getTrainingForm(@Param('slug') _slug: string) {
    return null;
  }
}
