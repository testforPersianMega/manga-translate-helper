import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { CreatePageDto, UpdatePageDto } from "./dto";

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(chapterId?: string) {
    return this.prisma.page.findMany({ where: chapterId ? { chapterId } : undefined });
  }

  async get(id: string) {
    return this.prisma.page.findUnique({ where: { id } });
  }

  async create(role: string, dto: CreatePageDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.page.create({ data: dto });
  }

  async update(id: string, role: string, dto: UpdatePageDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.page.update({ where: { id }, data: dto });
  }

  async remove(id: string, role: string) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.page.delete({ where: { id } });
  }
}
