import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import {
  getDomainCompletePaymentEntityProps,
  getDomainPaymentEntity,
  getValidPaymentEntityId,
} from '@/testing/payment/helpers';
import { getPaymentGatewayServiceMock } from '@/testing/payment/mock/payment-gateway-service.mock';
import { getPaymentRepositoryMock } from '@/testing/payment/mock/payment.repository.mock';
import { getDomainOrderEntity } from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import {
  Input,
  Output,
  RefreshPaymentStatusUseCase,
} from './refresh-payment-status.use-case';

describe('RefreshPaymentStatusUseCase', () => {
  let paymentRepositoryMock: jest.Mocked<PaymentRepository>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayService>;
  let sut: RefreshPaymentStatusUseCase;

  beforeEach(() => {
    paymentRepositoryMock = getPaymentRepositoryMock();
    orderRepositoryMock = getOrderRepositoryMock();
    paymentGatewayMock = getPaymentGatewayServiceMock();
    sut = new RefreshPaymentStatusUseCase(
      paymentRepositoryMock,
      orderRepositoryMock,
      paymentGatewayMock,
    );
  });

  describe('execute', function () {
    it('should throw an error if payment is not found with given id', () => {
      // Arrange
      const input: Input = {
        id: getValidPaymentEntityId(),
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Payment not found with given ID.');
    });

    it('should throw an error if payment method is not PIX', () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.CREDIT_CARD,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Only Pix payments can be refreshed.');
    });

    it('should throw an error if payment status is FAILED', () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.FAILED,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow(
        'Payment with status FAILED cannot be refreshed.',
      );
    });

    it('returns without calling payment gateway if the payment is already PAID', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PAID,
      });
      const input: Input = {
        id: entity.id,
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(paymentGatewayMock.isPixPaid).not.toHaveBeenCalled();
      expect(result).toEqual(output);
    });

    it('should throw an error if payment gateway service fails', () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PENDING,
      });
      const input: Input = {
        id: entity.id,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);
      paymentGatewayMock.isPixPaid.mockRejectedValueOnce(new Error('Error'));

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow(
        'There was an error refreshing the payment status: Error',
      );
    });

    it('should mark the payment as paid if the payment is paid', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const entity = getDomainPaymentEntity({
        ...props,
        paymentMethod: PaymentMethodEnum.PIX,
        status: PaymentStatusEnum.PENDING,
      });
      const order = getDomainOrderEntity({
        id: EntityIdValueObject.create(entity.orderId),
      });
      const input: Input = {
        id: entity.id,
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      paymentRepositoryMock.findById.mockResolvedValueOnce(entity);
      orderRepositoryMock.findById.mockResolvedValueOnce(order);
      paymentGatewayMock.isPixPaid.mockResolvedValueOnce(true);
      const paymentMarkAsPaidSpy = jest.spyOn(entity, 'markAsPaid');
      const orderMarkAsPaidSpy = jest.spyOn(order, 'markAsPaid');

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(paymentMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(orderMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledWith(
        entity.externalPaymentId,
      );
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(entity);
      expect(entity.status).toEqual(PaymentStatusEnum.PAID);
      expect(result).toEqual(output);
    });
  });
});
