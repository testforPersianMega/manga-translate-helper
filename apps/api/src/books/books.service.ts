import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { CreateBookDto, UpdateBookDto } from "./dto";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.book.findMany({ include: { chapters: true } });
  }

  async get(id: string) {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async create(createdById: string, role: string, dto: CreateBookDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.book.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        altTitles: dto.altTitles ?? [],
        description: dto.description,
        language: dto.language,
        status: dto.status,
        coverImageUrl: dto.coverImageUrl,
        meta: dto.meta,
        createdById
      }
    });
  }

  async update(id: string, role: string, dto: UpdateBookDto) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.book.update({
      where: { id },
      data: {
        ...dto,
        altTitles: dto.altTitles ?? undefined,
        meta: dto.meta
      }
    });
  }

  async remove(id: string, role: string) {
    assertRole(role, ["ADMIN", "EDITOR"]);
    return this.prisma.book.delete({ where: { id } });
  }
}
