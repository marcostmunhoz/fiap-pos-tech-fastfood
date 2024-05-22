import {
  getDomainCompletePaymentEntityProps,
  getDomainPaymentEntity,
} from '@/testing/payment/helpers';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { PaymentCanNotBeEditedException } from '../exception/payment-can-not-be-edited.exception';

describe('PaymentEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const payment = getDomainPaymentEntity(props);

      // Assert
      expect(payment.id).toEqual(props.id);
      expect(payment.orderId).toEqual(props.orderId);
      expect(payment.total).toEqual(props.total);
      expect(payment.paymentMethod).toEqual(props.paymentMethod);
      expect(payment.total).toEqual(props.total);
      expect(payment.createdAt).toEqual(props.createdAt);
      expect(payment.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('markAsPaid', () => {
    it('should mark the payment as paid', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const payment = getDomainPaymentEntity(props);
      const paymentSpy = jest.spyOn(payment as any, 'markAsUpdated');

      // Act
      payment.markAsPaid();

      // Assert
      expect(paymentSpy).toHaveBeenCalledTimes(1);
      expect(payment.status).toEqual(PaymentStatusEnum.PAID);
    });

    it('should throw an exception if the payment can not be edited', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const payment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PAID,
      });

      // Act
      const act = () => payment.markAsPaid();

      // Assert
      expect(act).toThrow(PaymentCanNotBeEditedException);
    });
  });

  describe('markAsFailed', () => {
    it('should mark the payment as failed', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const payment = getDomainPaymentEntity(props);
      const paymentSpy = jest.spyOn(payment as any, 'markAsUpdated');

      // Act
      payment.markAsFailed();

      // Assert
      expect(paymentSpy).toHaveBeenCalledTimes(1);
      expect(payment.status).toEqual(PaymentStatusEnum.FAILED);
    });

    it('should throw an exception if the payment can not be edited', async () => {
      // Arrange
      const props = getDomainCompletePaymentEntityProps();
      const payment = getDomainPaymentEntity({
        ...props,
        status: PaymentStatusEnum.PAID,
      });

      // Act
      const act = () => payment.markAsFailed();

      // Assert
      expect(act).toThrow(PaymentCanNotBeEditedException);
    });
  });
});
