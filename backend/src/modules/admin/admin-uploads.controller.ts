import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminUploadsService } from './admin-uploads.service.js';
import { PresignUploadDto } from './dto/presign-upload.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@Controller('admin/uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins can generate upload tickets!
export class AdminUploadsController {
  constructor(private readonly uploadsService: AdminUploadsService) {}

  @Post('presign')
  async getPresignedUrl(@Body() body: PresignUploadDto) {
    return this.uploadsService.getPresignedUrl(body);
  }
}
