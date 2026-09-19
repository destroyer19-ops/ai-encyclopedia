import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { TrainingsService } from './trainings.service.js';

@Controller()
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Public()
  @Get('trainings')
  async getPublicTrainings() {
    return this.trainingsService.findPublic();
  }

  @Get('admin/trainings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAdminTrainings() {
    return this.trainingsService.findAllAdmin();
  }

  @Post('admin/trainings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createTraining(@Body() body: any) {
    return this.trainingsService.create(body);
  }

  @Put('admin/trainings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateTraining(@Param('id') id: string, @Body() body: any) {
    return this.trainingsService.update(id, body);
  }

  @Delete('admin/trainings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteTraining(@Param('id') id: string) {
    await this.trainingsService.delete(id);
  }
}
