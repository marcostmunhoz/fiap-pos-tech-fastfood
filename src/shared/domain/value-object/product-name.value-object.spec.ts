import { ProductNameValueObject } from './product-name.value-object';

describe('ProductNameValueObject', () => {
  describe('create', () => {
    it('should create a ProductNameValueObject from a valid name', () => {
      // Arrange
      const name = 'Product Name';

      // Act
      const instance = ProductNameValueObject.create(name);

      // Assert
      expect(instance.value).toBe(name);
    });

    it('should throw an error when the name is empty', () => {
      // Arrange
      const emptyName = '';

      // Act
      const create = () => ProductNameValueObject.create(emptyName);

      // Act & Assert
      expect(create).toThrow('Invalid product name.');
    });

    it('should throw an error when the name is null', () => {
      // Arrange
      const nullName = null;

      // Act
      const create = () => ProductNameValueObject.create(nullName);

      // Act & Assert
      expect(create).toThrow('Invalid product name.');
    });

    it('should throw an error when the name is undefined', () => {
      // Arrange
      const undefinedName = undefined;

      // Act
      const create = () => ProductNameValueObject.create(undefinedName);

      // Act & Assert
      expect(create).toThrow('Invalid product name.');
    });

    it('should throw an error when the name is less than 2 characters', () => {
      // Arrange
      const shortName = 'A';

      // Act
      const create = () => ProductNameValueObject.create(shortName);

      // Act & Assert
      expect(create).toThrow('Invalid product name.');
    });

    it('should throw an error when the name is more than 100 characters', () => {
      // Arrange
      const longName = 'A'.repeat(101);

      // Act
      const create = () => ProductNameValueObject.create(longName);

      // Act & Assert
      expect(create).toThrow('Invalid product name.');
    });
  });
});
