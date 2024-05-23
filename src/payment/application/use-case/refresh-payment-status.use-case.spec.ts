import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import {
  getDomainCompletePaymentEntityProps,
  getDomainPaymentEntity,
  getValidPaymentEntityId,
} from '@/testing/payment/helpers';
import { getPaymentGatewayServiceMock } from '@/testing/payment/mock/payment-gateway-service.mock';
import { getPaymentRepositoryMock } from '@/testing/payment/mock/payment.repository.mock';
import { PaymentGatewayService } from '../service/payment-gateway.service.interface';
import {
  Input,
  Output,
  RefreshPaymentStatusUseCase,
} from './refresh-payment-status.use-case';

describe('RefreshPaymentStatusUseCase', () => {
  let repositoryMock: jest.Mocked<PaymentRepository>;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayService>;
  let sut: RefreshPaymentStatusUseCase;

  beforeEach(() => {
    repositoryMock = getPaymentRepositoryMock();
    paymentGatewayMock = getPaymentGatewayServiceMock();
    sut = new RefreshPaymentStatusUseCase(repositoryMock, paymentGatewayMock);
  });

  describe('execute', function () {
    it('should throw an error if payment is not found with given id', () => {
      // Arrange
      const input: Input = {
        id: getValidPaymentEntityId(),
      };
      repositoryMock.findById.mockResolvedValueOnce(null);

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
      repositoryMock.findById.mockResolvedValueOnce(entity);

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
      repositoryMock.findById.mockResolvedValueOnce(entity);

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
      repositoryMock.findById.mockResolvedValueOnce(entity);

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
      repositoryMock.findById.mockResolvedValueOnce(entity);
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
      const input: Input = {
        id: entity.id,
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      repositoryMock.findById.mockResolvedValueOnce(entity);
      paymentGatewayMock.isPixPaid.mockResolvedValueOnce(true);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledTimes(1);
      expect(paymentGatewayMock.isPixPaid).toHaveBeenCalledWith(
        entity.externalPaymentId,
      );
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(entity.status).toEqual(PaymentStatusEnum.PAID);
      expect(result).toEqual(output);
    });
  });
});
