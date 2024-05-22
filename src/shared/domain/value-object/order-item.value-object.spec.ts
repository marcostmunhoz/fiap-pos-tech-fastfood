import { ItemQuantityValueObject } from './item-quantity.value-object';
import { MoneyValueObject } from './money.value-object';
import { OrderItemValueObject } from './order-item.value-object';

describe('OrderItemValueObject', () => {
  describe('create', () => {
    it('should create an OrderItemValueObject from valid props', () => {
      // Assert
      const props = {
        code: '123',
        name: 'Item 1',
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const instance = OrderItemValueObject.create(props);

      // Assert
      expect(instance.code).toBe(props.code);
      expect(instance.name).toBe(props.name);
      expect(instance.quantity.equals(props.quantity)).toBe(true);
      expect(instance.price.equals(props.price)).toBe(true);
    });

    it('should throw an error when the code is empty', () => {
      // Arrange
      const props = {
        code: '',
        name: 'Item 1',
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });

    it('should throw an error when the code is undefined', () => {
      // Arrange
      const props = {
        code: undefined,
        name: 'Item 1',
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });

    it('should throw an error when the code is null', () => {
      // Arrange
      const props = {
        code: null,
        name: 'Item 1',
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });

    it('should throw an error when the name is empty', () => {
      // Arrange
      const props = {
        code: '123',
        name: '',
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });

    it('should throw an error when the name is undefined', () => {
      // Arrange
      const props = {
        code: '123',
        name: undefined,
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });

    it('should throw an error when the name is null', () => {
      // Arrange
      const props = {
        code: '123',
        name: null,
        quantity: ItemQuantityValueObject.create(1),
        price: MoneyValueObject.create(100),
      };

      // Act
      const create = () => OrderItemValueObject.create(props);

      // Act & Assert
      expect(create).toThrow('Invalid order item.');
    });
  });
});
