import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export enum TranslationEntryStatusDto {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEWED = "REVIEWED",
  FINAL = "FINAL"
}

export class CreateTranslationEntryDto {
  @IsString()
  projectId: string;

  @IsString()
  pageId: string;

  @IsObject()
  box: { x: number; y: number; w: number; h: number };

  @IsString()
  sourceText: string;

  @IsString()
  translatedText: string;

  @IsEnum(TranslationEntryStatusDto)
  status: TranslationEntryStatusDto;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateTranslationEntryDto {
  @IsOptional()
  @IsObject()
  box?: { x: number; y: number; w: number; h: number };

  @IsOptional()
  @IsString()
  sourceText?: string;

  @IsOptional()
  @IsString()
  translatedText?: string;

  @IsOptional()
  @IsEnum(TranslationEntryStatusDto)
  status?: TranslationEntryStatusDto;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
