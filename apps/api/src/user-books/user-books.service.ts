import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";

@Injectable()
export class UserBooksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(role: string, filters?: { userId?: string; bookId?: string }) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.userBook.findMany({
      where: filters,
      include: {
        user: { select: { id: true, email: true, username: true, role: true } },
        book: { select: { id: true, title: true, slug: true, language: true } }
      }
    });
  }

  async listMine(userId: string) {
    return this.prisma.userBook.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImageUrl: true,
            language: true,
            status: true
          }
        }
      }
    });
  }

  async grant(role: string, userId: string, bookId: string) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.userBook.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: {},
      create: { userId, bookId }
    });
  }

  async revoke(role: string, userId: string, bookId: string) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.userBook.delete({
      where: { userId_bookId: { userId, bookId } }
    });
  }
}
