import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";

export enum TranslationStatusDto {
  DRAFT = "DRAFT",
  COMPLETE = "COMPLETE"
}

export class UpsertTranslationDto {
  @IsString()
  chapterId!: string;

  @IsOptional()
  @IsObject()
  translatedJson?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(TranslationStatusDto)
  status?: TranslationStatusDto;
}

export class UpdateTranslationDto {
  @IsOptional()
  @IsObject()
  translatedJson?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(TranslationStatusDto)
  status?: TranslationStatusDto;
}
