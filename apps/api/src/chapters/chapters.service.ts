import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { CreateChapterDto, UpdateChapterDto } from "./dto";

@Injectable()
export class ChaptersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(bookId?: string) {
    return this.prisma.chapter.findMany({
      where: bookId ? { bookId } : undefined,
      include: { pages: true }
    });
  }

  async get(id: string) {
    return this.prisma.chapter.findUnique({ where: { id } });
  }

  async create(role: string, dto: CreateChapterDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.chapter.create({ data: dto });
  }

  async update(id: string, role: string, dto: UpdateChapterDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.chapter.update({ where: { id }, data: dto });
  }

  async remove(id: string, role: string) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.chapter.delete({ where: { id } });
  }
}
