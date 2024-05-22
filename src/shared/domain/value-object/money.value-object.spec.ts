import { MoneyValueObject } from './money.value-object';

describe('MoneyValueObject', () => {
  describe('create', () => {
    it('should create a MoneyValueObject from a valid value', () => {
      // Arrange
      const value = 100;

      // Act
      const instance = MoneyValueObject.create(value);

      // Assert
      expect(instance.value).toBe(value);
    });

    it('should throw an error when the value is negative', () => {
      // Arrange
      const negativeValue = -100;

      // Act
      const create = () => MoneyValueObject.create(negativeValue);

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

    it('should throw an error when the value is a float', () => {
      // Arrange
      const float = 100.1;

      // Act
      const create = () => MoneyValueObject.create(float);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });
  });

  describe('createFromFloat', () => {
    it('should create a MoneyValueObject from a valid float value', () => {
      // Arrange
      const value = 1.0;

      // Act
      const instance = MoneyValueObject.createFromFloat(value);

      // Assert
      expect(instance.value).toBe(100);
    });

    it('should throw an error when the value is negative', () => {
      // Arrange
      const negativeValue = -1.0;

      // Act
      const create = () => MoneyValueObject.createFromFloat(negativeValue);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });

    it('should throw an error when the value is NaN', () => {
      // Arrange
      const nanValue = NaN;

      // Act
      const create = () => MoneyValueObject.createFromFloat(nanValue);

      // Act & Assert
      expect(create).toThrow('Invalid money value.');
    });
  });
});
