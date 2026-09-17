import { IsString, IsNotEmpty } from 'class-validator';

export class PresignPaymentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
