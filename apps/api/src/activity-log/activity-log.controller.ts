import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ActivityLogService } from "./activity-log.service";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";

@Controller("/api/v1/activity")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class ActivityLogController {
  constructor(private readonly activityService: ActivityLogService) {}

  @Get()
  async list(@Req() req: { user: { role: string } }) {
    return this.activityService.list(req.user.role);
  }
}
