import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}
