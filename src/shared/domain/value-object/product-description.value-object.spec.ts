import { ProductDescriptionValueObject } from './product-description.value-object';

describe('ProductDescriptionValueObject', () => {
  describe('create', () => {
    it('should create a ProductDescriptionValueObject from a valid description', () => {
      // Arrange
      const description = 'Product Description';

      // Act
      const instance = ProductDescriptionValueObject.create(description);

      // Assert
      expect(instance.value).toBe(description);
    });

    it('should throw an error when the description is empty', () => {
      // Arrange
      const emptyDescription = '';

      // Act
      const create = () =>
        ProductDescriptionValueObject.create(emptyDescription);

      // Act & Assert
      expect(create).toThrow('Invalid product description.');
    });

    it('should throw an error when the description is null', () => {
      // Arrange
      const nullDescription = null;

      // Act
      const create = () =>
        ProductDescriptionValueObject.create(nullDescription);

      // Act & Assert
      expect(create).toThrow('Invalid product description.');
    });

    it('should throw an error when the description is undefined', () => {
      // Arrange
      const undefinedDescription = undefined;

      // Act
      const create = () =>
        ProductDescriptionValueObject.create(undefinedDescription);

      // Act & Assert
      expect(create).toThrow('Invalid product description.');
    });

    it('should throw an error when the description is less than 2 characters', () => {
      // Arrange
      const shortDescription = 'A';

      // Act
      const create = () =>
        ProductDescriptionValueObject.create(shortDescription);

      // Act & Assert
      expect(create).toThrow('Invalid product description.');
    });

    it('should throw an error when the description is more than 100 characters', () => {
      // Arrange
      const longDescription = 'A'.repeat(256);

      // Act
      const create = () =>
        ProductDescriptionValueObject.create(longDescription);

      // Act & Assert
      expect(create).toThrow('Invalid product description.');
    });
  });
});
