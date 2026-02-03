import { Body, Controller, Delete, Get, Param, Post, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { TranslationEntriesService } from "./translation-entries.service";
import { CreateTranslationEntryDto, UpdateTranslationEntryDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("/api/v1/entries")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "EDITOR", "TRANSLATOR")
export class TranslationEntriesController {
  constructor(private readonly entriesService: TranslationEntriesService) {}

  @Get()
  async list(@Query("projectId") projectId?: string, @Query("pageId") pageId?: string) {
    return this.entriesService.list(projectId, pageId);
  }

  @Post()
  async create(
    @Req() req: { user: { sub: string; role: string } },
    @Body() dto: CreateTranslationEntryDto
  ) {
    return this.entriesService.create(req.user.sub, req.user.role, dto);
  }

  @Patch(":id")
  async update(
    @Req() req: { user: { sub: string; role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateTranslationEntryDto
  ) {
    return this.entriesService.update(req.user.sub, req.user.role, id, dto);
  }

  @Delete(":id")
  async remove(@Req() req: { user: { role: string } }, @Param("id") id: string) {
    return this.entriesService.remove(id, req.user.role);
  }
}
