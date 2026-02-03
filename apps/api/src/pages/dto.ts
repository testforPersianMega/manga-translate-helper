import { IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreatePageDto {
  @IsString()
  chapterId!: string;

  @IsInt()
  pageNumber!: number;

  @IsUrl()
  imageUrl!: string;

  @IsInt()
  width!: number;

  @IsInt()
  height!: number;

  @IsString()
  checksum!: string;
}

export class UpdatePageDto {
  @IsOptional()
  @IsInt()
  pageNumber?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsString()
  checksum?: string;
}

export class CreateUploadUrlDto {
  @IsString()
  contentType!: string;
}
