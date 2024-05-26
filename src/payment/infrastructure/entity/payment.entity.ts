import { BaseEntity } from '@/shared/infrastructure/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentEntity extends BaseEntity {
  @Column({ name: 'order_id' })
  orderId: string;

  @Column()
  total: number;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column()
  status: string;

  @Column({ name: 'external_payment_id', nullable: true })
  externalPaymentId?: string;
}
