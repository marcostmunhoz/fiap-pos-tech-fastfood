import {
  CreatePaymentUseCase,
  Output,
} from '@/payment/application/use-case/create-payment.use-case';
import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import {
  getValidOrderEntityId,
  getValidPaymentEntityId,
} from '@/testing/payment/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentRequest } from '../dto/create-payment.request';
import { CreatePaymentController } from './create-payment.controller';

describe('CreatePaymentController', () => {
  let useCaseMock: jest.Mocked<CreatePaymentUseCase>;
  let controller: CreatePaymentController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreatePaymentUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreatePaymentUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [CreatePaymentController],
    }).compile();

    controller = module.get<CreatePaymentController>(CreatePaymentController);
  });

  describe('execute', () => {
    it('should return the created Pix payment', async () => {
      // Arrange
      const request: CreatePaymentRequest = {
        orderId: getValidOrderEntityId(),
        paymentMethod: PaymentMethodEnum.PIX,
      };
      const output: Output = {
        id: getValidPaymentEntityId(),
        status: PaymentStatusEnum.PENDING,
        paymentData: {
          qrCode: 'qr-code',
          qrCodeText: 'qr-code-text',
        },
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({
        id: output.id.value,
        status: output.status,
        paymentData: {
          qrCode: output.paymentData.qrCode,
          qrCodeText: output.paymentData.qrCodeText,
        },
      });
    });

    it('should return the created card payment', async () => {
      // Arrange
      const request: CreatePaymentRequest = {
        orderId: getValidOrderEntityId(),
        paymentMethod: PaymentMethodEnum.PIX,
        cardData: {
          number: '1111222233334444',
          expiration: '12/2030',
          verificationCode: '123',
        },
      };
      const output: Output = {
        id: getValidPaymentEntityId(),
        status: PaymentStatusEnum.PAID,
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({
        id: output.id.value,
        status: output.status,
      });
    });
  });
});
