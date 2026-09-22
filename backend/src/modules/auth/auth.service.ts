import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      user &&
      user.passwordHash &&
      (await bcrypt.compare(password, user.passwordHash))
    ) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
  async register(data: RegisterDto) {
    // check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // registr user

    const registerUser = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        authProvider: 'local',
        role: 'learner',
        persona: data.persona || 'Youth',
      },
    });

    await this.prisma.profile.create({
      data: {
        id: registerUser.id,
        email: registerUser.email,
        firstName: data.firstName?.trim() || null,
        lastName: data.lastName?.trim() || null,
        country: data.country?.trim() || null,
        phone: data.phone?.trim() || null,
      },
    });
    
    // Automatically log the user in after registration
    return this.login(registerUser);
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent.' };
    }
    const payload = { sub: user.id, email: user.email, purpose: 'reset' };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    console.log(`[DEV ONLY] Password reset link requested for ${email}. Token: ${resetToken}`);
    return { message: 'If the email exists, a reset link has been sent.', devToken: resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'reset') throw new Error('Invalid token purpose');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash: hashedPassword },
      });
      return { success: true };
    } catch (e) {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }

  async validateOrCreateGoogleUser(profile: { googleId: string, email: string, firstName: string, lastName: string, avatarUrl: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          authProvider: 'google',
          role: 'learner',
          persona: 'Youth',
        }
      });
      await this.prisma.profile.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        }
      });
    } else {
      if (user.authProvider !== 'google') {
        // Link accounts or keep it as is, frontend auth might expect 'local' or 'google'. 
        // We just return it to allow signin.
      }
    }
    return user;
  }
}
