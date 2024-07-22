import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { OrderItemValueObject } from '@/shared/domain/value-object/order-item.value-object';
import { getDomainOrderEntity } from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import { ListOrdersUseCase } from './list-orders.use-case';

describe('ListOrdersUseCase', () => {
  let repository: jest.Mocked<OrderRepository>;
  let sut: ListOrdersUseCase;

  beforeEach(() => {
    repository = getOrderRepositoryMock();
    sut = new ListOrdersUseCase(repository);
  });

  describe('execute', () => {
    it('should return the filtered orders', async () => {
      // Arrange
      const order1 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-1'),
        customerName: 'Customer 1',
        items: [
          OrderItemValueObject.create({
            code: 'PRD-001',
            name: 'X-Burger',
            price: MoneyValueObject.create(1500),
            quantity: ItemQuantityValueObject.create(2),
          }),
        ],
        status: OrderStatusEnum.PAID,
        updatedAt: new Date('2021-01-01T00:00:00Z'),
      });
      const order2 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-2'),
        customerName: 'Customer 2',
        items: [],
        status: OrderStatusEnum.PAID,
        updatedAt: new Date('2021-01-02T00:00:00Z'),
      });
      const order3 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-3'),
        customerName: 'Customer 3',
        items: [],
        status: OrderStatusEnum.PREPARING,
        updatedAt: new Date('2021-01-03T00:00:00Z'),
      });
      const order4 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-4'),
        customerName: 'Customer 4',
        items: [],
        status: OrderStatusEnum.PREPARING,
        updatedAt: new Date('2021-01-04T00:00:00Z'),
      });
      const order5 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-5'),
        customerName: 'Customer 5',
        items: [],
        status: OrderStatusEnum.READY,
        updatedAt: new Date('2021-01-05T00:00:00Z'),
      });
      const order6 = getDomainOrderEntity({
        id: EntityIdValueObject.create('order-id-6'),
        customerName: 'Customer 6',
        items: [],
        status: OrderStatusEnum.READY,
        updatedAt: new Date('2021-01-06T00:00:00Z'),
      });
      repository.listAscendingByUpdatedAt.mockResolvedValueOnce([
        order1,
        order2,
      ]);
      repository.listAscendingByUpdatedAt.mockResolvedValueOnce([
        order3,
        order4,
      ]);
      repository.listAscendingByUpdatedAt.mockResolvedValueOnce([
        order5,
        order6,
      ]);

      // Act
      const result = await sut.execute();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].status).toBe(OrderStatusEnum.PAID);
      expect(result[0].orders).toHaveLength(2);
      expect(result[0].orders[0].id).toBe('order-id-1');
      expect(result[0].orders[0].customerName).toBe('Customer 1');
      expect(result[0].orders[0].items).toHaveLength(1);
      expect(result[0].orders[0].items[0].code).toBe('PRD-001');
      expect(result[0].orders[0].items[0].name).toBe('X-Burger');
      expect(result[0].orders[0].items[0].price).toBe(15);
      expect(result[0].orders[0].items[0].quantity).toBe(2);
      expect(result[0].orders[0].updatedAt).toEqual(
        new Date('2021-01-01T00:00:00Z'),
      );
      expect(result[0].orders[1].id).toBe('order-id-2');
      expect(result[0].orders[1].customerName).toBe('Customer 2');
      expect(result[0].orders[1].updatedAt).toEqual(
        new Date('2021-01-02T00:00:00Z'),
      );
      expect(result[1].status).toBe(OrderStatusEnum.PREPARING);
      expect(result[1].orders).toHaveLength(2);
      expect(result[1].orders[0].id).toBe('order-id-3');
      expect(result[1].orders[0].customerName).toBe('Customer 3');
      expect(result[1].orders[0].updatedAt).toEqual(
        new Date('2021-01-03T00:00:00Z'),
      );
      expect(result[1].orders[1].id).toBe('order-id-4');
      expect(result[1].orders[1].customerName).toBe('Customer 4');
      expect(result[1].orders[1].updatedAt).toEqual(
        new Date('2021-01-04T00:00:00Z'),
      );
      expect(result[2].status).toBe(OrderStatusEnum.READY);
      expect(result[2].orders).toHaveLength(2);
      expect(result[2].orders[0].id).toBe('order-id-5');
      expect(result[2].orders[0].customerName).toBe('Customer 5');
      expect(result[2].orders[0].updatedAt).toEqual(
        new Date('2021-01-05T00:00:00Z'),
      );
      expect(result[2].orders[1].id).toBe('order-id-6');
      expect(result[2].orders[1].customerName).toBe('Customer 6');
      expect(result[2].orders[1].updatedAt).toEqual(
        new Date('2021-01-06T00:00:00Z'),
      );
    });
  });
});
