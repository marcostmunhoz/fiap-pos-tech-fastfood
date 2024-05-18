import { ProductCodeValueObject } from './product-code.value-object';

describe('ProductCodeValueObject', () => {
  describe('create', () => {
    it('should create a ProductCodeValueObject from a valid code', () => {
      // Arrange
      const name = 'CODE123';

      // Act
      const instance = ProductCodeValueObject.create(name);

      // Assert
      expect(instance.value).toBe(name);
    });

    it('should throw an error when the code is empty', () => {
      // Arrange
      const emptyCode = '';

      // Act
      const create = () => ProductCodeValueObject.create(emptyCode);

      // Act & Assert
      expect(create).toThrow('Invalid product code.');
    });

    it('should throw an error when the code is null', () => {
      // Arrange
      const nullCode = null;

      // Act
      const create = () => ProductCodeValueObject.create(nullCode);

      // Act & Assert
      expect(create).toThrow('Invalid product code.');
    });

    it('should throw an error when the code is undefined', () => {
      // Arrange
      const undefinedName = undefined;

      // Act
      const create = () => ProductCodeValueObject.create(undefinedName);

      // Act & Assert
      expect(create).toThrow('Invalid product code.');
    });

    it('should throw an error when the code is less than 2 characters', () => {
      // Arrange
      const shortCode = 'A';

      // Act
      const create = () => ProductCodeValueObject.create(shortCode);

      // Act & Assert
      expect(create).toThrow('Invalid product code.');
    });

    it('should throw an error when the code is more than 100 characters', () => {
      // Arrange
      const longCode = 'A'.repeat(21);

      // Act
      const create = () => ProductCodeValueObject.create(longCode);

      // Act & Assert
      expect(create).toThrow('Invalid product code.');
    });
  });
});
