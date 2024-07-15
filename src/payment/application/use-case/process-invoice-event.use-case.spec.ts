import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { getDomainPaymentEntity } from '@/testing/payment/helpers';
import { getPaymentRepositoryMock } from '@/testing/payment/mock/payment.repository.mock';
import { getDomainOrderEntity } from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import {
  Input,
  ProcessInvoiceEventUseCase,
} from './process-invoice-event.use-case';

describe('ProcessInvoiceEventUseCase', () => {
  let paymentRepositoryMock: jest.Mocked<PaymentRepository>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let sut: ProcessInvoiceEventUseCase;

  beforeEach(() => {
    paymentRepositoryMock = getPaymentRepositoryMock();
    orderRepositoryMock = getOrderRepositoryMock();
    sut = new ProcessInvoiceEventUseCase(
      paymentRepositoryMock,
      orderRepositoryMock,
    );
  });

  describe('execute', function () {
    it('should throw an error if payment is not found with given external payment id', () => {
      // Arrange
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'invalid-id',
          status: PaymentStatusEnum.PAID,
        },
      };
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(null);

      // Act
      const act = () => sut.execute(input);

      // Assert
      expect(act).rejects.toThrow('Payment not found with given ID.');
    });

    it('should mark payment and order as paid if status is PAID', async () => {
      // Arrange
      const order = getDomainOrderEntity();
      const payment = getDomainPaymentEntity({ orderId: order.id.value });
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'valid-id',
          status: PaymentStatusEnum.PAID,
        },
      };
      const paymentMarkAsPaidSpy = jest.spyOn(payment, 'markAsPaid');
      const orderMarkAsPaidSpy = jest.spyOn(order, 'markAsPaid');
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(
        payment,
      );
      orderRepositoryMock.findById.mockResolvedValueOnce(order);

      // Act
      await sut.execute(input);

      // Assert
      expect(paymentMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(orderMarkAsPaidSpy).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
    });

    it('should mark payment as failed and order as canceled if status is FAILED', async () => {
      // Arrange
      const order = getDomainOrderEntity();
      const payment = getDomainPaymentEntity({ orderId: order.id.value });
      const input: Input = {
        event: 'invoice.status_changed',
        data: {
          id: 'valid-id',
          status: PaymentStatusEnum.FAILED,
        },
      };
      const paymentMarkAsFailedSpy = jest.spyOn(payment, 'markAsFailed');
      const orderMarkAsCanceledSpy = jest.spyOn(order, 'markAsCanceled');
      paymentRepositoryMock.findByExternalPaymentId.mockResolvedValueOnce(
        payment,
      );
      orderRepositoryMock.findById.mockResolvedValueOnce(order);

      // Act
      await sut.execute(input);

      // Assert
      expect(paymentMarkAsFailedSpy).toHaveBeenCalledTimes(1);
      expect(orderMarkAsCanceledSpy).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith(payment);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
    });
  });
});
