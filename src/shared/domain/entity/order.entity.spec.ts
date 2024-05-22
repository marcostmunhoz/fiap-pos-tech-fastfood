import { OrderStatusEnum } from '../enum/order-status.enum';
import { ItemAlreadyAddedException } from '../exception/item-already-added.exception';
import { ItemNotFoundException } from '../exception/item-not-found.exception';
import { ItemQuantityValueObject } from '../value-object/item-quantity.value-object';
import { MoneyValueObject } from '../value-object/money.value-object';
import { OrderItemValueObject } from '../value-object/order-item.value-object';
import {
  getDomainOrderEntity,
  getDomainCompletedOrderEntityProps,
  getValidOrderItem,
} from '@/testing/shared/helpers';

describe('OrderEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const order = getDomainOrderEntity(props);

      // Assert
      expect(order.customerId).toEqual(props.customerId);
      expect(order.customerName).toEqual(props.customerName);
      expect(order.items).toEqual(props.items);
      expect(order.total).toEqual(props.total);
      expect(order.status).toEqual(props.status);
      expect(order.createdAt).toEqual(props.createdAt);
      expect(order.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('canBeEdited', () => {
    it('should return a boolean indicating whether the order status is PENDING', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const pendingOrder = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PENDING,
      });
      const paidOrder = getDomainOrderEntity({
        ...props,
        status: OrderStatusEnum.PAID,
      });

      // Act
      const pendingOrderResult = pendingOrder.canBeEdited();
      const paidOrderResult = paidOrder.canBeEdited();

      // Assert
      expect(pendingOrderResult).toBe(true);
      expect(paidOrderResult).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add an item to the order and update its total', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
        total: MoneyValueObject.zero(),
      });
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.addItem(item1);
      order.addItem(item2);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(2);
      expect(order.items).toHaveLength(2);
      expect(order.total.value).toEqual(500);
      expect(order.items[0].equals(item1)).toBe(true);
      expect(order.items[1].equals(item2)).toBe(true);
    });

    it('should throw an error if the item already exists in the order', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [item],
      });

      // Act
      const action = () => order.addItem(item);

      // Assert
      expect(action).toThrow(ItemAlreadyAddedException);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the order and update its total', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const order = getDomainOrderEntity({
        ...props,
        items: [item1, item2],
      });
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.removeItem(item1.code);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(order.items).toHaveLength(1);
      expect(order.total.value).toEqual(400);
      expect(order.items[0].equals(item2)).toBe(true);
    });

    it('should throw an error if the item does not exist in the order', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
      });

      // Act
      const action = () => order.removeItem(item.code);

      // Assert
      expect(action).toThrow(ItemNotFoundException);
    });
  });

  describe('changeItemQuantity', () => {
    it('should change the quantity of an item in the order and update its total', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const item1 = OrderItemValueObject.create({
        code: 'product-code-1',
        name: 'Product 1',
        price: MoneyValueObject.create(100),
        quantity: ItemQuantityValueObject.create(1),
      });
      const item2 = OrderItemValueObject.create({
        code: 'product-code-2',
        name: 'Product 2',
        price: MoneyValueObject.create(200),
        quantity: ItemQuantityValueObject.create(2),
      });
      const order = getDomainOrderEntity({
        ...props,
        items: [item1, item2],
      });
      const newQuantity = ItemQuantityValueObject.create(3);
      const markAsUpdatedSpy = jest.spyOn(order as any, 'markAsUpdated');

      // Act
      order.changeItemQuantity(item2.code, newQuantity);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(order.items).toHaveLength(2);
      expect(order.total.value).toEqual(700);
      expect(order.items[1].quantity.equals(newQuantity)).toBe(true);
    });

    it('should throw an error if the item does not exist in the order', async () => {
      // Arrange
      const props = getDomainCompletedOrderEntityProps();
      const item = getValidOrderItem();
      const order = getDomainOrderEntity({
        ...props,
        items: [],
      });

      // Act
      const action = () =>
        order.changeItemQuantity(item.code, ItemQuantityValueObject.create(1));

      // Assert
      expect(action).toThrow(ItemNotFoundException);
    });
  });
});
