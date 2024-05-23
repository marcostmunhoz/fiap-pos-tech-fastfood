import { Test, TestingModule } from '@nestjs/testing';
import { RefreshPaymentStatusController } from './refresh-payment-status.controller';
import {
  RefreshPaymentStatusUseCase,
  Output,
} from '@/payment/application/use-case/refresh-payment-status.use-case';
import {
  getValidOrderEntityId,
  getValidPaymentEntityId,
} from '@/testing/payment/helpers';
import { PaymentMethodEnum } from '@/payment/domain/enum/payment-method.enum';
import { PaymentStatusEnum } from '@/payment/domain/enum/payment-status.enum';
import { PaymentParam } from '../dto/payment.param';

describe('RefreshPaymentStatusController', () => {
  let useCaseMock: jest.Mocked<RefreshPaymentStatusUseCase>;
  let controller: RefreshPaymentStatusController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RefreshPaymentStatusUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RefreshPaymentStatusUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [RefreshPaymentStatusController],
    }).compile();

    controller = module.get<RefreshPaymentStatusController>(
      RefreshPaymentStatusController,
    );
  });

  describe('execute', () => {
    it('should return status of the payment', async () => {
      // Arrange
      const param: PaymentParam = {
        id: getValidPaymentEntityId(),
      };
      const output: Output = {
        status: PaymentStatusEnum.PAID,
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(param);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(param);
      expect(response).toEqual({
        status: PaymentStatusEnum.PAID,
      });
    });
  });
});
