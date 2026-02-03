import { Module } from "@nestjs/common";
import { TranslationEntriesController } from "./translation-entries.controller";
import { TranslationEntriesService } from "./translation-entries.service";
import { PrismaService } from "../common/prisma.service";

@Module({
  controllers: [TranslationEntriesController],
  providers: [TranslationEntriesService, PrismaService]
})
export class TranslationEntriesModule {}
