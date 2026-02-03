import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { TranslationsService } from "./translations.service";
import { UpdateTranslationDto, UpsertTranslationDto } from "./dto";

@Controller("/api/v1/translations")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "EDITOR", "TRANSLATOR", "VIEWER")
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  async list(
    @Req() req: { user: { sub: string; role: string } },
    @Query("chapterId") chapterId?: string,
    @Query("userId") userId?: string
  ) {
    return this.translationsService.list(req.user.sub, req.user.role, { chapterId, userId });
  }

  @Post()
  async upsert(
    @Req() req: { user: { sub: string; role: string } },
    @Body() dto: UpsertTranslationDto
  ) {
    return this.translationsService.upsert(req.user.sub, req.user.role, dto);
  }

  @Patch(":id")
  async update(
    @Req() req: { user: { sub: string; role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateTranslationDto
  ) {
    return this.translationsService.update(req.user.sub, req.user.role, id, dto);
  }
}
