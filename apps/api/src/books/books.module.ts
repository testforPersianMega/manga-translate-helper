import { Module } from "@nestjs/common";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { PrismaService } from "../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [BooksController],
  providers: [BooksService, PrismaService]
})
export class BooksModule {}
