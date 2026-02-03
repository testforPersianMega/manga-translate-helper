import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import {
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordConfirmDto,
  ResetPasswordRequestDto
} from "./dto";
import { JwtAuthGuard } from "./jwt.guard";

@Controller("/api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(ThrottlerGuard)
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.userId, dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Body() dto: RefreshDto, @Req() req: { user: { sub: string } }) {
    return this.authService.logout(req.user.sub, dto.refreshToken);
  }

  @Post("reset-password/request")
  async requestReset(@Body() dto: ResetPasswordRequestDto) {
    return { message: "Reset email queued", email: dto.email };
  }

  @Post("reset-password/confirm")
  async confirmReset(@Body() dto: ResetPasswordConfirmDto) {
    return { message: "Password reset stub", token: dto.token, newPassword: dto.newPassword };
  }
}
