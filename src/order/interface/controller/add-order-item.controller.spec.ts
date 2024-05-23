import { AddOrderItemUseCase } from '@/order/application/use-case/add-order-item.use-case';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { getValidOrderEntityId } from '@/testing/shared/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemRequest } from '../dto/order-item.request';
import { OrderParam } from '../dto/order.param';
import { AddOrderItemController } from './add-order-item.controller';

describe('AddOrderItemController', () => {
  let useCaseMock: jest.Mocked<AddOrderItemUseCase>;
  let controller: AddOrderItemController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AddOrderItemUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddOrderItemUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [AddOrderItemController],
    }).compile();

    controller = module.get<AddOrderItemController>(AddOrderItemController);
  });

  describe('execute', () => {
    it('should add an item to the existing order', async () => {
      // Arrange
      const param: OrderParam = {
        id: getValidOrderEntityId(),
      };
      const request: OrderItemRequest = {
        productCode: 'product-code',
        quantity: ItemQuantityValueObject.create(1),
      };

      // Act
      await controller.execute(param, request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        id: param.id,
        data: request,
      });
    });
  });
});
