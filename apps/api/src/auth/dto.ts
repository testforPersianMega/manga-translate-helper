import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  userId!: string;

  @IsString()
  refreshToken!: string;
}

export class ResetPasswordRequestDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordConfirmDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @IsOptional()
  @IsString()
  oldPassword?: string;
}
