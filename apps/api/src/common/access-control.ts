import { ForbiddenException } from "@nestjs/common";

export const assertRole = (role: string, allowed: string[]) => {
  if (!allowed.includes(role)) {
    throw new ForbiddenException("Insufficient role");
  }
};
