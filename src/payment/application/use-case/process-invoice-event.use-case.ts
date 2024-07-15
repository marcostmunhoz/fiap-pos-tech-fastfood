import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import { PaymentRepositoryToken } from '@/payment/tokens';
import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = {
  event: 'invoice.status_changed';
  data: {
    id: string;
    status: PaymentStatusEnum;
  };
};

export type Output = void;

export class ProcessInvoiceEventUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({ data }: Input): Promise<Output> {
    const payment = await this.paymentRepository.findByExternalPaymentId(
      data.id,
    );

    if (!payment) {
      throw new EntityNotFoundException('Payment not found with given ID.');
    }

    const order = await this.orderRepository.findById(
      EntityIdValueObject.create(payment.orderId),
    );

    if (data.status === PaymentStatusEnum.PAID) {
      payment.markAsPaid();
      order.markAsPaid();
    } else if (data.status === PaymentStatusEnum.FAILED) {
      payment.markAsFailed();
      order.markAsCanceled();
    }

    await this.paymentRepository.save(payment);
    await this.orderRepository.save(order);
  }
}
