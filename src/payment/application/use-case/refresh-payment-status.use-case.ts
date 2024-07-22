import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { InvalidPaymentMethodException } from '@/payment/domain/exception/invalid-payment-method.exception';
import { InvalidPaymentStatusException } from '@/payment/domain/exception/invalid-payment-status.exception';
import { PaymentFailedException } from '@/payment/domain/exception/payment-failed.exception';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  PaymentGatewayServiceToken,
  PaymentRepositoryToken,
} from '@/payment/tokens';
import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';

export type Input = {
  id: EntityIdValueObject;
};

export type Output = {
  status: PaymentStatusEnum;
};

export class RefreshPaymentStatusUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    @Inject(PaymentGatewayServiceToken)
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const payment = await this.paymentRepository.findById(input.id);

    if (!payment) {
      throw new EntityNotFoundException('Payment not found with given ID.');
    }

    if (PaymentMethodEnum.PIX !== payment.paymentMethod) {
      throw new InvalidPaymentMethodException(
        'Only Pix payments can be refreshed.',
      );
    }

    if (PaymentStatusEnum.FAILED === payment.status) {
      throw new InvalidPaymentStatusException(
        'Payment with status FAILED cannot be refreshed.',
      );
    }

    if (PaymentStatusEnum.PAID === payment.status) {
      return { status: payment.status };
    }

    const order = await this.orderRepository.findById(
      EntityIdValueObject.create(payment.orderId),
    );

    try {
      const idPaid = await this.paymentGatewayService.isPixPaid(
        payment.externalPaymentId,
      );

      if (idPaid) {
        payment.markAsPaid();
        order.markAsPaid();
        this.paymentRepository.save(payment);
        this.orderRepository.save(order);
      }

      return { status: payment.status };
    } catch (error) {
      throw new PaymentFailedException(
        `There was an error refreshing the payment status: ${error.message || 'Generic error'}`,
      );
    }
  }
}
