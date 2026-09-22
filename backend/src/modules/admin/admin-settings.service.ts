import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.appSetting.findMany();
    // Return them exactly in the format the frontend expects: { key: string, value: any }[]
    return settings.map((s) => ({
      key: s.key,
      value: s.value,
    }));
  }

  async updateSettings(settings: { key: string; value: any }[]) {
    // Perform bulk upserts
    await this.prisma.$transaction(
      settings.map((s) =>
        this.prisma.appSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        }),
      ),
    );
    return { ok: true };
  }
}
