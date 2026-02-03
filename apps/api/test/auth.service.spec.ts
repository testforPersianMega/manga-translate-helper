import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../src/auth/auth.service";

const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findUniqueOrThrow: jest.fn()
  },
  refreshToken: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn()
  }
};

describe("AuthService", () => {
  it("register issues tokens", async () => {
    const jwtService = new JwtService();
    const service = new AuthService(prismaMock as any, jwtService);
    prismaMock.user.create.mockResolvedValue({ id: "user-1", role: "VIEWER" });
    prismaMock.refreshToken.create.mockResolvedValue({});
    jest.spyOn(jwtService, "signAsync").mockResolvedValue("token");

    const result = await service.register({
      email: "test@example.com",
      username: "test",
      password: "password123"
    });

    expect(result.accessToken).toBe("token");
    expect(result.refreshToken).toBeDefined();
  });
});
