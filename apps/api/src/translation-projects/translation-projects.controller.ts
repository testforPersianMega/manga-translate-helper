import { Body, Controller, Delete, Get, Param, Post, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { TranslationProjectsService } from "./translation-projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("/api/v1/projects")
export class TranslationProjectsController {
  constructor(private readonly projectsService: TranslationProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Query("chapterId") chapterId?: string) {
    return this.projectsService.list(chapterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async get(@Param("id") id: string) {
    return this.projectsService.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR", "TRANSLATOR")
  @Post()
  async create(
    @Req() req: { user: { sub: string; role: string } },
    @Body() dto: CreateProjectDto
  ) {
    return this.projectsService.create(req.user.sub, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR", "TRANSLATOR")
  @Patch(":id")
  async update(
    @Req() req: { user: { role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto
  ) {
    return this.projectsService.update(id, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Delete(":id")
  async remove(@Req() req: { user: { role: string } }, @Param("id") id: string) {
    return this.projectsService.remove(id, req.user.role);
  }
}
