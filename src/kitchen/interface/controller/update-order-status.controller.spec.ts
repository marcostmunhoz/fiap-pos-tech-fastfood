import { UpdateOrderStatusUseCase } from '@/kitchen/application/use-case/update-order-status.use-case';
import { OrderParam } from '@/order/interface/dto/order.param';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { getValidOrderEntityId } from '@/testing/shared/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusRequest } from '../dto/update-order-status.request';
import { UpdateOrderStatusController } from './update-order-status.controller';

describe('UpdateOrderStatusController', () => {
  let useCaseMock: jest.Mocked<UpdateOrderStatusUseCase>;
  let controller: UpdateOrderStatusController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateOrderStatusUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateOrderStatusUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [UpdateOrderStatusController],
    }).compile();

    controller = module.get<UpdateOrderStatusController>(
      UpdateOrderStatusController,
    );
  });

  describe('execute', () => {
    it('should update the order status', async () => {
      // Arrange
      const param: OrderParam = { id: getValidOrderEntityId() };
      const request: UpdateOrderStatusRequest = {
        status: OrderStatusEnum.PREPARING,
      };

      // Act
      await controller.execute(param, request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        id: param.id,
        data: { status: request.status },
      });
    });
  });
});
