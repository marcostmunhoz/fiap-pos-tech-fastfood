import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdGeneratorHelperToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import {
  PartialPaymentEntityProps,
  PaymentEntity,
} from '../entity/payment.entity';
import { PaymentStatusEnum } from '../enum/payment-status.enum';

export class PaymentFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createPayment(props: PartialPaymentEntityProps): PaymentEntity {
    return new PaymentEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      status: PaymentStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
