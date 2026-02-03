import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

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
}
