import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { PaymentEntity } from '../entity/payment.entity';

export interface PaymentRepository {
  findById(id: EntityIdValueObject): Promise<PaymentEntity>;
  existsWithOrderIdAndNotFailed(orderId: string): Promise<boolean>;
  save(payment: PaymentEntity): Promise<PaymentEntity>;
}
