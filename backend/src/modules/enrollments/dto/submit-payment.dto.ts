import { IsString, IsUrl } from 'class-validator';

export class SubmitPaymentDto {
  @IsString()
  @IsUrl()
  paymentProofUrl: string;
}
