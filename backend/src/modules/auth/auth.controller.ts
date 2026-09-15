import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.js';
@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: any }, @Body() body: LoginDto) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
