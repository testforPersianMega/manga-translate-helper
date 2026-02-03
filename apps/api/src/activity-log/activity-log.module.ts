import { Module } from "@nestjs/common";
import { ActivityLogController } from "./activity-log.controller";
import { ActivityLogService } from "./activity-log.service";
import { PrismaService } from "../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, PrismaService]
})
export class ActivityLogModule {}
