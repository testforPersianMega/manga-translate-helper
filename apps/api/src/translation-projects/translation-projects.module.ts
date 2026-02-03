import { Module } from "@nestjs/common";
import { TranslationProjectsController } from "./translation-projects.controller";
import { TranslationProjectsService } from "./translation-projects.service";
import { PrismaService } from "../common/prisma.service";

@Module({
  controllers: [TranslationProjectsController],
  providers: [TranslationProjectsService, PrismaService]
})
export class TranslationProjectsModule {}
