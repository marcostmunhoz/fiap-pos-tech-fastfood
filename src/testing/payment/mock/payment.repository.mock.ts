import { PaymentRepository } from '@/payment/domain/repository/payment.repository.interface';

export const getPaymentRepositoryMock = (): jest.Mocked<PaymentRepository> => ({
  findById: jest.fn(),
  findByExternalPaymentId: jest.fn(),
  existsWithOrderIdAndNotFailed: jest.fn(),
  save: jest.fn(),
});
