import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsArray } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class UpdatePasswordDto {
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
