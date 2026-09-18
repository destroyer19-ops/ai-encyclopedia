import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsObject,
} from 'class-validator';
export class CreateModuleDto {
  @IsString()
  @IsNotEmpty({ message: 'This is a required field' })
  title: string;

  @IsInt()
  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['video', 'pdf', 'document', 'presentation', 'text', 'quiz'])
  contentType: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsString()
  @IsOptional()
  contentBody?: string;

  @IsObject()
  @IsOptional()
  contentMeta?: Record<string, unknown>;
}
