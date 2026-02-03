import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { UpdateTranslationDto, UpsertTranslationDto } from "./dto";

@Injectable()
export class TranslationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    requesterId: string,
    role: string,
    filters?: { chapterId?: string; userId?: string }
  ) {
    if (filters?.userId && filters.userId !== requesterId) {
      assertRole(role, ["ADMIN"]);
    }
    return this.prisma.translation.findMany({
      where: {
        userId: filters?.userId ?? requesterId,
        chapterId: filters?.chapterId
      },
      include: {
        chapter: { select: { id: true, title: true, number: true, bookId: true } }
      }
    });
  }

  async upsert(requesterId: string, role: string, dto: UpsertTranslationDto) {
    return this.prisma.translation.upsert({
      where: { chapterId_userId: { chapterId: dto.chapterId, userId: requesterId } },
      update: {
        translatedJson: dto.translatedJson,
        status: dto.status
      },
      create: {
        chapterId: dto.chapterId,
        userId: requesterId,
        translatedJson: dto.translatedJson,
        status: dto.status
      }
    });
  }

  async update(requesterId: string, role: string, id: string, dto: UpdateTranslationDto) {
    const translation = await this.prisma.translation.findUnique({ where: { id } });
    if (!translation) {
      throw new NotFoundException();
    }
    if (translation.userId !== requesterId) {
      assertRole(role, ["ADMIN"]);
    }
    return this.prisma.translation.update({
      where: { id },
      data: dto
    });
  }
}
