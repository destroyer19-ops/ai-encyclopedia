import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Request,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  getProfile(@Request() req: { user: any }) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('me/profile')
  updateProfile(@Request() req: { user: any }, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, body);
  }
}
