import { FullNameValueObject } from './full-name.value-object';

describe('FullNameValueObject', () => {
  describe('createFromFullName', () => {
    it('should create a FullNameValueObject from a valid full name', () => {
      // Arrange
      const fullName = 'John Something Doe';

      // Act
      const instance = FullNameValueObject.createFromFullName(fullName);

      // Assert
      expect(instance.value).toBe(fullName);
      expect(instance.firstName).toBe('John');
      expect(instance.lastName).toBe('Something Doe');
    });

    it('should throw an error when the full name is invalid', () => {
      // Arrange
      const invalidFullName = 'John';

      // Act
      const create = () =>
        FullNameValueObject.createFromFullName(invalidFullName);

      // Assert
      expect(create).toThrow('Invalid name.');
    });
  });

  describe('createFromNameParts', () => {
    it('should create a FullNameValueObject from valid first name and last name', () => {
      // Arrange
      const firstName = 'John';
      const lastName = 'Doe';

      // Act
      const instance = FullNameValueObject.createFromNameParts(
        firstName,
        lastName,
      );

      // Assert
      expect(instance.value).toBe('John Doe');
      expect(instance.firstName).toBe(firstName);
      expect(instance.lastName).toBe(lastName);
    });
  });
});
