import { IsOptional, IsString } from 'class-validator';

export class QueryCoursesDto {
  @IsOptional()
  @IsString()
  persona?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
