import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  controllers: [TranslationsController],
  providers: [TranslationsService, PrismaService]
})
export class TranslationsModule {}
