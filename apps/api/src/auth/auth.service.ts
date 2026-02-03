import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../common/prisma.service";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { LoginDto, RegisterDto } from "./dto";
import type { RefreshToken } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash
      }
    });
    return this.issueTokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.isBanned) {
      throw new UnauthorizedException();
    }
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    return this.issueTokens(user.id, user.role);
  }

  async refresh(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    const match = await Promise.all(
      tokens.map(async (token: RefreshToken) => ({
        id: token.id,
        matches: await bcrypt.compare(refreshToken, token.tokenHash)
      }))
    );
    const tokenMatch = match.find((item) => item.matches);
    if (!tokenMatch) {
      throw new ForbiddenException();
    }
    await this.prisma.refreshToken.update({
      where: { id: tokenMatch.id },
      data: { revokedAt: new Date() }
    });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this.issueTokens(user.id, user.role);
  }

  async logout(userId: string, refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null
      }
    });
    for (const token of tokens) {
      const matches = await bcrypt.compare(refreshToken, token.tokenHash);
      if (matches) {
        await this.prisma.refreshToken.update({
          where: { id: token.id },
          data: { revokedAt: new Date() }
        });
      }
    }
    return { success: true };
  }

  async issueTokens(userId: string, role: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: "15m"
      }
    );
    const refreshToken = randomBytes(48).toString("hex");
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
    return { accessToken, refreshToken };
  }
}
