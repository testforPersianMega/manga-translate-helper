import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";

export enum BookStatusDto {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS"
}

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  altTitles?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  language: string;

  @IsEnum(BookStatusDto)
  status: BookStatusDto;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsArray()
  altTitles?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(BookStatusDto)
  status?: BookStatusDto;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;
}
