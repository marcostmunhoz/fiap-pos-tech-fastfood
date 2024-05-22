import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { Input, RemoveOrderItemUseCase } from './remove-order-item.use-case';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import {
  getDomainCompleteOrderEntityProps,
  getDomainOrderEntity,
  getValidOrderEntityId,
  getValidOrderItem,
} from '@/testing/shared/helpers';

describe('RemoveOrderItemUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let sut: RemoveOrderItemUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    sut = new RemoveOrderItemUseCase(orderRepositoryMock);
  });

  describe('execute', () => {
    it('should remove an item from the order', async () => {
      // Arrange
      const item = getValidOrderItem();
      const props = getDomainCompleteOrderEntityProps();
      const order = getDomainOrderEntity({
        ...props,
        items: [item],
      });
      const input: Input = {
        id: order.id,
        data: {
          productCode: item.code,
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      const orderSpy = jest.spyOn(order, 'removeItem');

      // Act
      await sut.execute(input);

      // Assert
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(orderSpy).toHaveBeenCalledWith(input.data.productCode);
    });

    it('should throw an error if order is not found', async () => {
      // Arrange
      const input: Input = {
        id: getValidOrderEntityId(),
        data: {
          productCode: 'product-code',
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow('Order not found with given ID.');
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(input.id);
    });
  });
});
