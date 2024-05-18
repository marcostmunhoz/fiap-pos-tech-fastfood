import { MoneyValueObject } from './money.value-object';

describe('MoneyValueObject', () => {
  describe('create', () => {
    it('should create a MoneyValueObject from a valid value', () => {
      // Arrange
      const value = 10.5;

      // Act
      const instance = MoneyValueObject.create(value);

      // Assert
      expect(instance.value).toBe(value);
    });

    it('should throw an error when the value is negative', () => {
      // Arrange
      const negativeValue = -10.5;

      // Act
      const create = () => MoneyValueObject.create(negativeValue);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });

    it('should throw an error when the value is zero', () => {
      // Arrange
      const zeroValue = 0;

      // Act
      const create = () => MoneyValueObject.create(zeroValue);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });

    it('should throw an error when the value is lesser than the minimum value', () => {
      // Arrange
      const value = 0.001;

      // Act
      const create = () => MoneyValueObject.create(value);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });

    it('should throw an error when the value is NaN', () => {
      // Arrange
      const nanValue = NaN;

      // Act
      const create = () => MoneyValueObject.create(nanValue);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });
  });
});
