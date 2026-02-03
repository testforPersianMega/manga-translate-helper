import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { assertRole } from "../common/access-control";

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async list(role: string) {
    assertRole(role, ["ADMIN"]);
    return this.prisma.activityLog.findMany({ orderBy: { createdAt: "desc" } });
  }
}
