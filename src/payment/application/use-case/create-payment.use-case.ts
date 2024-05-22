import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import {
  PaymentGatewayServiceToken,
  PaymentRepositoryToken,
} from '@/payment/tokens';
import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Inject } from '@nestjs/common';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import { PaymentFactory } from '@/payment/domain/factory/payment.factory';
import { OrderRepositoryToken } from '@/shared/tokens';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { PaymentEntity } from '@/payment/domain/entity/payment.entity';
import { OrderEntity } from '@/shared/domain/entity/order.entity';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { PaymentFailedException } from '@/payment/domain/exception/payment-failed.exception';

export type CardPaymentInput = {
  orderId: string;
  paymentMethod:
    | PaymentMethodEnum.CREDIT_CARD
    | PaymentMethodEnum.DEBIT_CARD
    | PaymentMethodEnum.VOUCHER;
  cardData: {
    number: string;
    expiration: string;
    verificationCode: string;
  };
};

export type PixPaymentInput = {
  orderId: string;
  paymentMethod: PaymentMethodEnum.PIX;
};

export type Input = CardPaymentInput | PixPaymentInput;

export type CardPaymentOutput = {
  id: EntityIdValueObject;
  status: PaymentStatusEnum.PAID;
};

export type PixPaymentOutput = {
  id: EntityIdValueObject;
  status: PaymentStatusEnum.PENDING;
  paymentData: {
    qrCode: string;
    qrCodeText: string;
  };
};

export type Output = CardPaymentOutput | PixPaymentOutput;

export class CreatePaymentUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(PaymentGatewayServiceToken)
    private readonly paymentGatewayService: PaymentGatewayService,
    @Inject(PaymentRepositoryToken)
    private readonly paymentRepository: PaymentRepository,
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    private readonly paymentFactory: PaymentFactory,
  ) {}

  async execute(input: Input): Promise<Output> {
    const exists = await this.paymentRepository.existsWithOrderIdAndNotFailed(
      input.orderId,
    );

    if (exists) {
      throw new EntityAlreadyExistsException(
        'A pending or paid payment already exists for the given order ID.',
      );
    }

    const order = await this.orderRepository.findById(
      EntityIdValueObject.create(input.orderId),
    );

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    const payment = this.paymentFactory.createPayment({
      orderId: input.orderId,
      total: order.total,
      paymentMethod: input.paymentMethod,
    });

    try {
      if (PaymentMethodEnum.PIX === input.paymentMethod) {
        return await this.createPixPayment(order, payment);
      }

      return await this.createCardPayment(order, payment, input);
    } catch (error) {
      throw new PaymentFailedException(
        `There was an error processing the payment: ${error.message || 'Generic error'}`,
      );
    } finally {
      await this.paymentRepository.save(payment);
      await this.orderRepository.save(order);
    }
  }

  private async createPixPayment(
    order: OrderEntity,
    payment: PaymentEntity,
  ): Promise<PixPaymentOutput> {
    try {
      const { id, qrCode, qrCodeText } =
        await this.paymentGatewayService.createPixPayment({
          amount: payment.total,
        });

      payment.setExternalPaymentId(id);
      order.markAsPaid();

      return {
        id: payment.id,
        status: PaymentStatusEnum.PENDING,
        paymentData: {
          qrCode,
          qrCodeText,
        },
      };
    } catch (error) {
      payment.markAsFailed();
      order.markAsCanceled();

      throw error;
    }
  }

  private async createCardPayment(
    order: OrderEntity,
    payment: PaymentEntity,
    data: CardPaymentInput,
  ): Promise<CardPaymentOutput> {
    try {
      const method = this.getPaymentGatewayMethodBasedOnPaymentMethod(
        data.paymentMethod,
      );
      const { id } = await this.paymentGatewayService[method]({
        amount: payment.total,
        cardNumber: data.cardData.number,
        cardExpirationDate: data.cardData.expiration,
        cardVerificationCode: data.cardData.verificationCode,
      });

      payment.setExternalPaymentId(id).markAsPaid();
      order.markAsPaid();

      return {
        id: payment.id,
        status: PaymentStatusEnum.PAID,
      };
    } catch (error) {
      payment.markAsFailed();
      order.markAsCanceled();

      throw error;
    }
  }

  private getPaymentGatewayMethodBasedOnPaymentMethod(
    paymentMethod: PaymentMethodEnum,
  ): string {
    let method:
      | 'createCreditCardPayment'
      | 'createDebitCardPayment'
      | 'createVoucherPayment';

    if (PaymentMethodEnum.CREDIT_CARD === paymentMethod) {
      method = 'createCreditCardPayment';
    } else if (PaymentMethodEnum.DEBIT_CARD === paymentMethod) {
      method = 'createDebitCardPayment';
    } else {
      method = 'createVoucherPayment';
    }

    return method;
  }
}
