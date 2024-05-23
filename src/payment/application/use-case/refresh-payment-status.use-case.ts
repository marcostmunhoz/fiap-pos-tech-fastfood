import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { InvalidPaymentMethodException } from '@/payment/domain/exception/invalid-payment-method.exception';
import { InvalidPaymentStatusException } from '@/payment/domain/exception/invalid-payment-status.exception';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  PaymentGatewayServiceToken,
  PaymentRepositoryToken,
} from '@/payment/tokens';
import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Inject } from '@nestjs/common';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import { PaymentFailedException } from '@/payment/domain/exception/payment-failed.exception';

export type Input = {
  id: EntityIdValueObject;
};

export type Output = {
  status: PaymentStatusEnum;
};

export class RefreshPaymentStatusUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentRepositoryToken)
    private readonly repository: PaymentRepository,
    @Inject(PaymentGatewayServiceToken)
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const payment = await this.repository.findById(input.id);

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

    try {
      const idPaid = await this.paymentGatewayService.isPixPaid(
        payment.externalPaymentId,
      );

      if (idPaid) {
        payment.markAsPaid();
        this.repository.save(payment);
      }

      return { status: payment.status };
    } catch (error) {
      throw new PaymentFailedException(
        `There was an error refreshing the payment status: ${error.message || 'Generic error'}`,
      );
    }
  }
}
