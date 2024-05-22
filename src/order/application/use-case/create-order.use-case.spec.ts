import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { Input, CreateOrderUseCase } from './create-order.use-case';
import { OrderFactory } from '@/shared/domain/factory/order.factory';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import { getOrderFactoryMock } from '@/testing/shared/mock/order.factory.mock';
import { getDomainOrderEntity } from '@/testing/shared/helpers';

describe('CreateOrderUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let orderFactoryMock: jest.Mocked<OrderFactory>;
  let sut: CreateOrderUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    orderFactoryMock = getOrderFactoryMock();
    sut = new CreateOrderUseCase(orderRepositoryMock, orderFactoryMock);
  });

  describe('execute', () => {
    it('should create an order', async () => {
      // Arrange
      const input: Input = {
        customerId: 'customer-id',
        customerName: 'customer-name',
      };
      const order = getDomainOrderEntity();
      orderFactoryMock.createOrder.mockReturnValueOnce(order);
      orderRepositoryMock.save.mockResolvedValueOnce(order);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(orderFactoryMock.createOrder).toHaveBeenCalledTimes(1);
      expect(orderFactoryMock.createOrder).toHaveBeenCalledWith(input);
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(result.id.equals(order.id)).toBe(true);
    });
  });
});
