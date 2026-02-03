import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserBooksService } from "./user-books.service";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { UserBookDto, UserBookQueryDto } from "./dto";

@Controller("/api/v1/user-books")
export class UserBooksController {
  constructor(private readonly userBooksService: UserBooksService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  async list(@Req() req: { user: { role: string } }, @Query() query: UserBookQueryDto) {
    return this.userBooksService.list(req.user.role, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mine")
  async listMine(@Req() req: { user: { sub: string } }) {
    return this.userBooksService.listMine(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  async grant(@Req() req: { user: { role: string } }, @Body() dto: UserBookDto) {
    return this.userBooksService.grant(req.user.role, dto.userId, dto.bookId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete()
  async revoke(@Req() req: { user: { role: string } }, @Body() dto: UserBookDto) {
    return this.userBooksService.revoke(req.user.role, dto.userId, dto.bookId);
  }
}
