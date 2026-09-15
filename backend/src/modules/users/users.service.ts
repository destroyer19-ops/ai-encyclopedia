import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: data.gender,
        birthYear: data.birthYear,
        nationality: data.nationality,
        persona: data.persona,
        employmentStatus: data.employmentStatus,
      },
    });
  }
  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        gender: true,
        birthYear: true,
        nationality: true,
        persona: true,
        employmentStatus: true,
        role: true,
      },
    });
  }
}
