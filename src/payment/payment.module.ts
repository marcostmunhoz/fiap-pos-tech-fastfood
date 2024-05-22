import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { PaymentFactory } from './domain/factory/payment.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './infrastructure/entity/payment.entity';
import { PaymentRepositoryToken } from './tokens';
import { TypeOrmPaymentRepository } from './infrastructure/repository/type-orm-payment.repository';

const factories = [PaymentFactory];

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), SharedModule],
  providers: [
    {
      provide: PaymentRepositoryToken,
      useClass: TypeOrmPaymentRepository,
    },
    ...factories,
  ],
})
export class PaymentModule {}
