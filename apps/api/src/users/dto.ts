import { IsBoolean, IsEnum, IsOptional } from "class-validator";

export enum RoleDto {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  TRANSLATOR = "TRANSLATOR",
  VIEWER = "VIEWER"
}

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(RoleDto)
  role?: RoleDto;

  @IsOptional()
  @IsBoolean()
  isBanned?: boolean;
}
