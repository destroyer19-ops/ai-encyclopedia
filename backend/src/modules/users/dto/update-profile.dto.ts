import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  @Min(1990)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  employmentStatus?: string;

  @IsOptional()
  @IsString()
  persona?: string;
}
