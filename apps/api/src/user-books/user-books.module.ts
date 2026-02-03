import { Module } from "@nestjs/common";
import { UserBooksController } from "./user-books.controller";
import { UserBooksService } from "./user-books.service";
import { PrismaService } from "../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UserBooksController],
  providers: [UserBooksService, PrismaService]
})
export class UserBooksModule {}
