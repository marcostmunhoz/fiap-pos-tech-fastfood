import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';

export const getPaymentRepositoryMock = (): jest.Mocked<PaymentRepository> => ({
  existsWithOrderIdAndNotFailed: jest.fn(),
  save: jest.fn(),
});
