import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { CreateTranslationEntryDto, UpdateTranslationEntryDto } from "./dto";

@Injectable()
export class TranslationEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId?: string, pageId?: string) {
    return this.prisma.translationEntry.findMany({
      where: {
        projectId: projectId ?? undefined,
        pageId: pageId ?? undefined
      }
    });
  }

  async create(userId: string, role: string, dto: CreateTranslationEntryDto) {
    assertRole(role, ["ADMIN", "EDITOR", "TRANSLATOR"]);
    return this.prisma.translationEntry.create({
      data: {
        ...dto,
        updatedById: userId
      }
    });
  }

  async update(userId: string, role: string, id: string, dto: UpdateTranslationEntryDto) {
    assertRole(role, ["ADMIN", "EDITOR", "TRANSLATOR"]);
    return this.prisma.translationEntry.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId
      }
    });
  }

  async remove(id: string, role: string) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.translationEntry.delete({ where: { id } });
  }
}
