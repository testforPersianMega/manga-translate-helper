import { Body, Controller, Delete, Get, Param, Post, Patch, Req, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto, UpdateBookDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("/api/v1/books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async list() {
    return this.booksService.list();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.booksService.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Post()
  async create(@Req() req: { user: { sub: string; role: string } }, @Body() dto: CreateBookDto) {
    return this.booksService.create(req.user.sub, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Patch(":id")
  async update(
    @Req() req: { user: { role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateBookDto
  ) {
    return this.booksService.update(id, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Delete(":id")
  async remove(@Req() req: { user: { role: string } }, @Param("id") id: string) {
    return this.booksService.remove(id, req.user.role);
  }
}
