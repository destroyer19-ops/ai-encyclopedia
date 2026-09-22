import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

type TrainingInput = {
  title?: string;
  summary?: string | null;
  country?: string;
  city?: string | null;
  venue?: string | null;
  eventDate?: string | Date | null;
  event_date?: string | Date | null;
  endDate?: string | Date | null;
  end_date?: string | Date | null;
  eventTime?: string | null;
  event_time?: string | null;
  format?: string | null;
  registrationUrl?: string | null;
  registration_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  published?: boolean;
  sortOrder?: number | string | null;
  sort_order?: number | string | null;
};

function nullableDate(value: string | Date | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(`${value}T00:00:00.000Z`);
}

function normalizeTrainingInput(data: TrainingInput) {
  const eventDate = data.eventDate ?? data.event_date;
  const endDate = data.endDate ?? data.end_date;
  const eventTime = data.eventTime ?? data.event_time;
  const registrationUrl = data.registrationUrl ?? data.registration_url;
  const imageUrl = data.imageUrl ?? data.image_url;
  const sortOrder = data.sortOrder ?? data.sort_order;
  return {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.summary !== undefined && { summary: data.summary ?? '' }),
    ...(data.country !== undefined && { country: data.country }),
    ...(data.city !== undefined && { city: data.city ?? '' }),
    ...(data.venue !== undefined && { venue: data.venue ?? '' }),
    ...(eventDate !== undefined && { eventDate: nullableDate(eventDate) }),
    ...(endDate !== undefined && { endDate: nullableDate(endDate) }),
    ...(eventTime !== undefined && { eventTime: eventTime ?? '' }),
    ...(data.format !== undefined && { format: data.format ?? 'In person' }),
    ...(registrationUrl !== undefined && { registrationUrl: registrationUrl ?? '' }),
    ...(imageUrl !== undefined && { imageUrl: imageUrl ?? '' }),
    ...(data.published !== undefined && { published: data.published }),
    ...(sortOrder !== undefined && { sortOrder: Number(sortOrder ?? 0) }),
  };
}

function formatDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

function toFrontendTraining(row: any) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    country: row.country,
    city: row.city,
    venue: row.venue,
    event_date: formatDate(row.eventDate),
    end_date: formatDate(row.endDate),
    event_time: row.eventTime,
    format: row.format,
    registration_url: row.registrationUrl,
    image_url: row.imageUrl,
    published: row.published,
    sort_order: row.sortOrder,
  };
}

@Injectable()
export class TrainingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic() {
    const rows = await this.prisma.training.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { eventDate: 'asc' }],
    });
    return rows.map(toFrontendTraining);
  }

  async findAllAdmin() {
    const rows = await this.prisma.training.findMany({
      orderBy: [{ sortOrder: 'asc' }, { eventDate: 'asc' }],
    });
    return rows.map(toFrontendTraining);
  }

  async create(data: TrainingInput) {
    const normalized = normalizeTrainingInput(data);
    const row = await this.prisma.training.create({
      data: {
        title: normalized.title ?? '',
        country: normalized.country ?? '',
        summary: normalized.summary ?? '',
        city: normalized.city ?? '',
        venue: normalized.venue ?? '',
        eventDate: normalized.eventDate ?? null,
        endDate: normalized.endDate ?? null,
        eventTime: normalized.eventTime ?? '',
        format: normalized.format ?? 'In person',
        registrationUrl: normalized.registrationUrl ?? '',
        imageUrl: normalized.imageUrl ?? '',
        published: normalized.published ?? true,
        sortOrder: normalized.sortOrder ?? 0,
      },
    });
    return toFrontendTraining(row);
  }

  async update(id: string, data: TrainingInput) {
    await this.ensureTraining(id);
    const row = await this.prisma.training.update({
      where: { id },
      data: normalizeTrainingInput(data),
    });
    return toFrontendTraining(row);
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
