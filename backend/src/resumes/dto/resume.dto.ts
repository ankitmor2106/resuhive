import { IsString, IsOptional, IsObject, IsEnum, IsArray } from 'class-validator';

export enum ResumeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateResumeDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export class UpdateResumeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(ResumeStatus)
  @IsOptional()
  status?: ResumeStatus;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  professionalSummary?: string;

  @IsArray()
  @IsOptional()
  sectionOrder?: string[];

  @IsOptional()
  personalInfo?: any;

  @IsOptional()
  experience?: any;

  @IsOptional()
  education?: any;

  @IsOptional()
  projects?: any;

  @IsOptional()
  skills?: any;

  @IsOptional()
  certifications?: any;

  @IsOptional()
  achievements?: any;

  @IsOptional()
  positions?: any;

  @IsOptional()
  languages?: any;

  @IsOptional()
  interests?: any;

  @IsOptional()
  custom?: any;

  @IsOptional()
  theme?: any;
}
