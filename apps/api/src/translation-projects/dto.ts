import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

export enum ProjectStatusDto {
  ACTIVE = "ACTIVE",
  DONE = "DONE",
  ARCHIVED = "ARCHIVED"
}

export class CreateProjectDto {
  @IsString()
  chapterId: string;

  @IsOptional()
  @IsArray()
  assignedUserIds?: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsEnum(ProjectStatusDto)
  status?: ProjectStatusDto;

  @IsOptional()
  @IsArray()
  assignedUserIds?: string[];
}
