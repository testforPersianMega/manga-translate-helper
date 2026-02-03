import { Module } from "@nestjs/common";
import { ChaptersController } from "./chapters.controller";
import { ChaptersService } from "./chapters.service";
import { PrismaService } from "../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ChaptersController],
  providers: [ChaptersService, PrismaService]
})
export class ChaptersModule {}
