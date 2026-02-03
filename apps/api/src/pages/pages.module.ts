import { Module } from "@nestjs/common";
import { PagesController } from "./pages.controller";
import { PagesService } from "./pages.service";
import { PrismaService } from "../common/prisma.service";
import { AssetsModule } from "../assets/assets.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AssetsModule, AuthModule],
  controllers: [PagesController],
  providers: [PagesService, PrismaService]
})
export class PagesModule {}
