import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";
import { UpdateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(role: string) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        isBanned: true
      }
    });
  }

  async update(userId: string, role: string, dto: UpdateUserDto) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.user.update({
      where: { id: userId },
      data: dto
    });
  }
}
