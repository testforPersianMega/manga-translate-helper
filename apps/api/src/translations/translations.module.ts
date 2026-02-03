import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaService } from "../common/prisma.service";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  imports: [AuthModule],
  controllers: [TranslationsController],
  providers: [TranslationsService, PrismaService]
})
export class TranslationsModule {}
