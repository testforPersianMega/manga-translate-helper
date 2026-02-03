import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString } from "class-validator";

export enum PublishStatusDto {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export class CreateChapterDto {
  @IsString()
  bookId!: string;

  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsInt()
  orderIndex!: number;

  @IsEnum(PublishStatusDto)
  publishStatus!: PublishStatusDto;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsObject()
  sourceJson?: Record<string, unknown>;
}

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsEnum(PublishStatusDto)
  publishStatus?: PublishStatusDto;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsObject()
  sourceJson?: Record<string, unknown>;
}
