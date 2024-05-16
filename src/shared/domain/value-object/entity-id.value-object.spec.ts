import { EntityIdValueObject } from './entity-id.value-object';

describe('EntityIdValueObject', () => {
  describe('create', () => {
    it('should create an EntityIdValueObject from a valid id', () => {
      // Arrange
      const id = '123';

      // Act
      const instance = EntityIdValueObject.create(id);

      // Assert
      expect(instance.value).toBe(id);
    });

    it('should throw an error when the id is empty', () => {
      // Arrange
      const emptyId = '';

      // Act
      const create = () => EntityIdValueObject.create(emptyId);

      // Act & Assert
      expect(create).toThrow('Invalid ID.');
    });

    it('should throw an error when the id is null', () => {
      // Arrange
      const nullId = null;

      // Act
      const create = () => EntityIdValueObject.create(nullId);

      // Act & Assert
      expect(create).toThrow('Invalid ID.');
    });

    it('should throw an error when the id is undefined', () => {
      // Arrange
      const undefinedId = undefined;

      // Act
      const create = () => EntityIdValueObject.create(undefinedId);

      // Act & Assert
      expect(create).toThrow('Invalid ID.');
    });
  });
});
