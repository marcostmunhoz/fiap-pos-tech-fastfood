import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { PaymentFactory } from './domain/factory/payment.factory';

const factories = [PaymentFactory];

@Module({
  imports: [SharedModule],
  providers: [...factories],
})
export class PaymentModule {}
