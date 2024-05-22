import { PaymentFactory } from '@/payment/domain/factory/payment.factory';

export const getPaymentFactoryMock = (): jest.Mocked<PaymentFactory> =>
  ({
    createPayment: jest.fn(),
  }) as unknown as jest.Mocked<PaymentFactory>;
