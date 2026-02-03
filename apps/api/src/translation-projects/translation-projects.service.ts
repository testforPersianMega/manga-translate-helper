import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { CreateProjectDto, UpdateProjectDto } from "./dto";

@Injectable()
export class TranslationProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(chapterId?: string) {
    return this.prisma.translationProject.findMany({
      where: chapterId ? { chapterId } : undefined,
      include: { assignments: true, entries: true }
    });
  }

  async get(id: string) {
    return this.prisma.translationProject.findUnique({
      where: { id },
      include: { assignments: true, entries: true }
    });
  }

  async create(ownerId: string, role: string, dto: CreateProjectDto) {
    assertRole(role, ["ADMIN", "EDITOR", "TRANSLATOR"]);
    return this.prisma.translationProject.create({
      data: {
        chapterId: dto.chapterId,
        ownerId,
        assignments: {
          create: dto.assignedUserIds?.map((userId) => ({ userId })) ?? []
        }
      },
      include: { assignments: true }
    });
  }

  async update(id: string, role: string, dto: UpdateProjectDto) {
    assertRole(role, ["ADMIN", "EDITOR", "TRANSLATOR"]);
    return this.prisma.translationProject.update({
      where: { id },
      data: {
        status: dto.status,
        assignments: dto.assignedUserIds
          ? {
              deleteMany: {},
              create: dto.assignedUserIds.map((userId) => ({ userId }))
            }
          : undefined
      },
      include: { assignments: true }
    });
  }

  async remove(id: string, role: string) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.translationProject.delete({ where: { id } });
  }
}
