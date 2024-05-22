import { PaymentGatewayService } from '@/payment/application/service/payment-gateway.service.interface';

export const getPaymentGatewayServiceMock =
  (): jest.Mocked<PaymentGatewayService> => ({
    createPixPayment: jest.fn(),
    isPixPaid: jest.fn(),
    createCreditCardPayment: jest.fn(),
    createDebitCardPayment: jest.fn(),
    createVoucherPayment: jest.fn(),
  });
