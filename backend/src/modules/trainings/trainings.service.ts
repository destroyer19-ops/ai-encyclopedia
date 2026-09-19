import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

type TrainingInput = {
  title?: string;
  summary?: string | null;
  country?: string;
  city?: string | null;
  venue?: string | null;
  eventDate?: string | Date | null;
  endDate?: string | Date | null;
  eventTime?: string | null;
  format?: string | null;
  registrationUrl?: string | null;
  imageUrl?: string | null;
  published?: boolean;
  sortOrder?: number | string | null;
};

function nullableDate(value: string | Date | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(`${value}T00:00:00.000Z`);
}

function normalizeTrainingInput(data: TrainingInput) {
  return {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.summary !== undefined && { summary: data.summary ?? '' }),
    ...(data.country !== undefined && { country: data.country }),
    ...(data.city !== undefined && { city: data.city ?? '' }),
    ...(data.venue !== undefined && { venue: data.venue ?? '' }),
    ...(data.eventDate !== undefined && { eventDate: nullableDate(data.eventDate) }),
    ...(data.endDate !== undefined && { endDate: nullableDate(data.endDate) }),
    ...(data.eventTime !== undefined && { eventTime: data.eventTime ?? '' }),
    ...(data.format !== undefined && { format: data.format ?? 'In person' }),
    ...(data.registrationUrl !== undefined && { registrationUrl: data.registrationUrl ?? '' }),
    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl ?? '' }),
    ...(data.published !== undefined && { published: data.published }),
    ...(data.sortOrder !== undefined && { sortOrder: Number(data.sortOrder ?? 0) }),
  };
}

@Injectable()
export class TrainingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic() {
    return this.prisma.training.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { eventDate: 'asc' }],
    });
  }

  async findAllAdmin() {
    return this.prisma.training.findMany({
      orderBy: [{ sortOrder: 'asc' }, { eventDate: 'asc' }],
    });
  }

  async create(data: TrainingInput) {
    return this.prisma.training.create({
      data: {
        title: data.title ?? '',
        country: data.country ?? '',
        summary: data.summary ?? '',
        city: data.city ?? '',
        venue: data.venue ?? '',
        eventDate: nullableDate(data.eventDate),
        endDate: nullableDate(data.endDate),
        eventTime: data.eventTime ?? '',
        format: data.format ?? 'In person',
        registrationUrl: data.registrationUrl ?? '',
        imageUrl: data.imageUrl ?? '',
        published: data.published ?? true,
        sortOrder: Number(data.sortOrder ?? 0),
      },
    });
  }

  async update(id: string, data: TrainingInput) {
    await this.ensureTraining(id);
    return this.prisma.training.update({
      where: { id },
      data: normalizeTrainingInput(data),
    });
  }

  async delete(id: string) {
    await this.ensureTraining(id);
    return this.prisma.training.delete({ where: { id } });
  }

  private async ensureTraining(id: string) {
    const training = await this.prisma.training.findUnique({ where: { id }, select: { id: true } });
    if (!training) throw new NotFoundException('Training not found.');
    return training;
  }
}
