import { Module } from "@nestjs/common";
import { TranslationProjectsController } from "./translation-projects.controller";
import { TranslationProjectsService } from "./translation-projects.service";
import { PrismaService } from "../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [TranslationProjectsController],
  providers: [TranslationProjectsService, PrismaService]
})
export class TranslationProjectsModule {}
