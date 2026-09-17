import { IsEnum } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsEnum(['approved', 'rejected'])
  status: 'approved' | 'rejected';
}
