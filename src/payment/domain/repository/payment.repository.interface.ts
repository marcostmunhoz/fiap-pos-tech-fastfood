import { PaymentEntity } from '../entity/payment.entity';

export interface PaymentRepository {
  existsWithOrderIdAndNotFailed(orderId: string): Promise<boolean>;
  save(payment: PaymentEntity): Promise<void>;
}
