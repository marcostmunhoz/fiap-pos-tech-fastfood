import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { OrderItemValueObject } from '@/shared/domain/value-object/order-item.value-object';
import {
  getDomainCompleteOrderEntityProps,
  getDomainOrderEntity,
  getDomainProductEntity,
  getValidOrderEntityId,
} from '@/testing/shared/helpers';
import { getOrderRepositoryMock } from '@/testing/shared/mock/order.repository.mock';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { AddOrderItemUseCase, Input } from './add-order-item.use-case';

describe('AddOrderItemUseCase', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let productRepositoryMock: jest.Mocked<ProductRepository>;
  let sut: AddOrderItemUseCase;

  beforeEach(() => {
    orderRepositoryMock = getOrderRepositoryMock();
    productRepositoryMock = getProductRepositoryMock();
    sut = new AddOrderItemUseCase(orderRepositoryMock, productRepositoryMock);
  });

  describe('execute', () => {
    it('should add an item to the order', async () => {
      // Arrange
      const orderProps = getDomainCompleteOrderEntityProps();
      const order = getDomainOrderEntity({
        ...orderProps,
        items: [],
      });
      const product = getDomainProductEntity();
      const input: Input = {
        id: order.id,
        data: {
          productCode: product.code.value,
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      productRepositoryMock.findByCode.mockResolvedValue(product);
      const orderSpy = jest.spyOn(order, 'addItem');

      // Act
      await sut.execute(input);

      // Assert
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(order.id);
      expect(productRepositoryMock.findByCode).toHaveBeenCalledTimes(1);
      expect(productRepositoryMock.findByCode).toHaveBeenCalledWith(
        product.code,
      );
      expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(orderSpy).toHaveBeenCalledTimes(1);
      expect(orderSpy).toHaveBeenCalledWith(
        OrderItemValueObject.create({
          code: product.code.value,
          name: product.name.value,
          price: product.price,
          quantity: input.data.quantity,
        }),
      );
    });

    it('should throw an error if order is not found', async () => {
      // Arrange
      const input: Input = {
        id: getValidOrderEntityId(),
        data: {
          productCode: 'product-code',
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow('Order not found with given ID.');
    });

    it('should throw an error if product is not found', async () => {
      // Arrange
      const orderProps = getDomainCompleteOrderEntityProps();
      const order = getDomainOrderEntity({
        ...orderProps,
        items: [],
      });
      const input: Input = {
        id: order.id,
        data: {
          productCode: 'product-code',
          quantity: ItemQuantityValueObject.create(2),
        },
      };
      orderRepositoryMock.findById.mockResolvedValue(order);
      productRepositoryMock.findByCode.mockResolvedValue(null);

      // Act
      const result = sut.execute(input);

      // Assert
      await expect(result).rejects.toThrow(
        'Product not found with given code.',
      );
    });
  });
});
