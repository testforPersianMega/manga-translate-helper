import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { UpdateUserDto } from "./dto";

@Controller("/api/v1/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list(@Req() req: { user: { role: string } }) {
    return this.usersService.list(req.user.role);
  }

  @Patch(":id")
  async update(
    @Req() req: { user: { role: string } },
    @Param("id") id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.update(id, req.user.role, dto);
  }
}
