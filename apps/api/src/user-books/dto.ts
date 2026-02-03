import { IsOptional, IsString } from "class-validator";

export class UserBookDto {
  @IsString()
  userId!: string;

  @IsString()
  bookId!: string;
}

export class UserBookQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  bookId?: string;
}
