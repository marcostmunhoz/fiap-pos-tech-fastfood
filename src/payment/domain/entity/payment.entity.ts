import { AbstractEntity } from '@/shared/domain/entity/abstract.entity';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { PaymentMethodEnum } from '../enum/payment-method.enum';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { PaymentCanNotBeEditedException } from '../exception/payment-can-not-be-edited.exception';

export type PartialPaymentEntityProps = {
  orderId: string;
  total: MoneyValueObject;
  paymentMethod: PaymentMethodEnum;
};

export type CompletePaymentEntityProps = PartialPaymentEntityProps & {
  id: EntityIdValueObject;
  status: PaymentStatusEnum;
  externalPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PaymentEntity extends AbstractEntity<CompletePaymentEntityProps> {
  public get orderId(): string {
    return this.props.orderId;
  }

  public get total(): MoneyValueObject {
    return this.props.total;
  }

  public get paymentMethod(): PaymentMethodEnum {
    return this.props.paymentMethod;
  }

  public get status(): PaymentStatusEnum {
    return this.props.status;
  }

  public get externalPaymentId(): string {
    return this.props.externalPaymentId;
  }

  public canBeEdited(): boolean {
    return PaymentStatusEnum.PENDING === this.status;
  }

  public setExternalPaymentId(id: string): PaymentEntity {
    this.props.externalPaymentId = id;
    this.markAsUpdated();

    return this;
  }

  public markAsPaid(): PaymentEntity {
    this.ensureCanBeEdited();

    this.props.status = PaymentStatusEnum.PAID;
    this.markAsUpdated();

    return this;
  }

  public markAsFailed(): PaymentEntity {
    this.ensureCanBeEdited();

    this.props.status = PaymentStatusEnum.FAILED;
    this.markAsUpdated();

    return this;
  }

  private ensureCanBeEdited(): void {
    if (!this.canBeEdited()) {
      throw new PaymentCanNotBeEditedException();
    }
  }
}
