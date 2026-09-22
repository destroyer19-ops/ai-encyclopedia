import { Controller, UseGuards, Post, Get, Request, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: any }, @Body() body: LoginDto) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Request() req: any) {
    // Initiates Google OAuth
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthRedirect(@Request() req: any, @Res() res: any) {
    const tokens = this.authService.login(req.user);
    // Redirect to the frontend /auth page with the JWT as a query param.
    // The auth page reads access_token from the URL via useEffect on mount.
    const frontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
    const frontendBase = frontendOrigins[0].trim().replace(/\/$/, '');
    res.redirect(`${frontendBase}/auth?access_token=${tokens.access_token}`);
  }
}
