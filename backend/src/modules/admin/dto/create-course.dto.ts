import { IsString, IsNotEmpty, IsEnum, MaxLength, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'This is a required field' })
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['Youth', 'Parents', 'Educators', 'MasterTrainers'])
  persona: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  ecardUrl?: string;
}
