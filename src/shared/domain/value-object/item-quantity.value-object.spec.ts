import { ItemQuantityValueObject } from './item-quantity.value-object';

describe('ItemQuantityValueObject', () => {
  describe('create', () => {
    it('should create a ItemQuantityValueObject from a valid value', () => {
      // Arrange
      const value = 1;

      // Act
      const instance = ItemQuantityValueObject.create(value);

      // Assert
      expect(instance.value).toBe(value);
    });

    it('should throw an error when the value is negative', () => {
      // Arrange
      const negativeValue = -1;

      // Act
      const create = () => ItemQuantityValueObject.create(negativeValue);

      // Act & Assert
      expect(create).toThrow('Invalid quantity value.');
    });

    it('should throw an error when the value is NaN', () => {
      // Arrange
      const nanValue = NaN;

      // Act
      const create = () => ItemQuantityValueObject.create(nanValue);

      // Act & Assert
      expect(create).toThrow('Invalid quantity value.');
    });

    it('should throw an error when the value is a float', () => {
      // Arrange
      const float = 1.1;

      // Act
      const create = () => ItemQuantityValueObject.create(float);

      // Act & Assert
      expect(create).toThrow('Invalid quantity value.');
    });
  });
});
