import { Body, Controller, Delete, Get, Param, Post, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import { CreateChapterDto, UpdateChapterDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("/api/v1/chapters")
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  async list(@Query("bookId") bookId?: string) {
    return this.chaptersService.list(bookId);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.chaptersService.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Post()
  async create(@Req() req: { user: { role: string } }, @Body() dto: CreateChapterDto) {
    return this.chaptersService.create(req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Patch(":id")
  async update(
    @Req() req: { user: { role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateChapterDto
  ) {
    return this.chaptersService.update(id, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Delete(":id")
  async remove(@Req() req: { user: { role: string } }, @Param("id") id: string) {
    return this.chaptersService.remove(id, req.user.role);
  }
}
