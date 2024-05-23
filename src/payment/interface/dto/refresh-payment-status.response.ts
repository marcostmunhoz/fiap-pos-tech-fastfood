import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshPaymentStatusResponse {
  @Expose()
  @ApiProperty({
    example: PaymentStatusEnum.PAID,
    enum: PaymentStatusEnum,
  })
  status: string;
}
