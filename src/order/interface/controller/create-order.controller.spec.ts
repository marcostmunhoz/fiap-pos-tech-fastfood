import {
  CreateOrderUseCase,
  Output,
} from '@/order/application/use-case/create-order.use-case';
import { getValidOrderEntityId } from '@/testing/shared/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderRequest } from '../dto/create-order.request';
import { CreateOrderController } from './create-order.controller';

describe('CreateOrderController', () => {
  let useCaseMock: jest.Mocked<CreateOrderUseCase>;
  let controller: CreateOrderController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateOrderUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [CreateOrderController],
    }).compile();

    controller = module.get<CreateOrderController>(CreateOrderController);
  });

  describe('execute', () => {
    it('should return the created order', async () => {
      // Arrange
      const request: CreateOrderRequest = {
        customerId: 'customer-id',
        customerName: 'John Doe',
      };
      const output: Output = {
        id: getValidOrderEntityId(),
      };
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({ id: output.id.value });
    });
  });
});
