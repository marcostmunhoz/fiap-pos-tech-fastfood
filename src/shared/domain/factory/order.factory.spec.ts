import {
  getDomainPartialOrderEntityProps,
  getValidOrderEntityId,
} from '@/testing/shared/helpers';
import { getEntityIdGeneratorHelperMock } from '@/testing/shared/mock/entity-id-generator.helper.mock';
import { OrderEntity } from '../entity/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { EntityIdGeneratorHelper } from '../helper/entity-id-generator.helper.interface';
import { MoneyValueObject } from '../value-object/money.value-object';
import { OrderFactory } from './order.factory';

describe('OrderFactory', () => {
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: OrderFactory;

  beforeEach(() => {
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new OrderFactory(entityIdGeneratorMock);
  });

  describe('createOrder', () => {
    it('should create an instance of the order entity', () => {
      // Arrange
      const props = getDomainPartialOrderEntityProps();
      const id = getValidOrderEntityId();
      entityIdGeneratorMock.generate.mockReturnValue(id);
      const expectedDate = new Date();
      const dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => expectedDate);

      // Act
      const order = sut.createOrder(props);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(dateSpy).toHaveBeenCalledTimes(2);
      expect(order).toBeInstanceOf(OrderEntity);
      expect(order.customerId).toEqual(props.customerId);
      expect(order.customerName).toEqual(props.customerName);
      expect(order.id).toEqual(id);
      expect(order.items).toEqual([]);
      expect(order.total.equals(MoneyValueObject.zero())).toBe(true);
      expect(order.status).toEqual(OrderStatusEnum.PENDING);
      expect(order.createdAt).toEqual(expectedDate);
      expect(order.updatedAt).toEqual(expectedDate);
    });
  });
});
