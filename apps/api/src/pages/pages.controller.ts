import { Body, Controller, Delete, Get, Param, Post, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { PagesService } from "./pages.service";
import { CreatePageDto, CreateUploadUrlDto, UpdatePageDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { S3Service } from "../assets/s3.service";

@Controller("/api/v1/pages")
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  async list(@Query("chapterId") chapterId?: string) {
    return this.pagesService.list(chapterId);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.pagesService.get(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Post()
  async create(@Req() req: { user: { role: string } }, @Body() dto: CreatePageDto) {
    return this.pagesService.create(req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Patch(":id")
  async update(
    @Req() req: { user: { role: string } },
    @Param("id") id: string,
    @Body() dto: UpdatePageDto
  ) {
    return this.pagesService.update(id, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR")
  @Delete(":id")
  async remove(@Req() req: { user: { role: string } }, @Param("id") id: string) {
    return this.pagesService.remove(id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "EDITOR", "TRANSLATOR")
  @Post("upload-url")
  async createUploadUrl(@Body() dto: CreateUploadUrlDto) {
    return this.s3Service.createUploadUrl("pages", dto.contentType);
  }
}
