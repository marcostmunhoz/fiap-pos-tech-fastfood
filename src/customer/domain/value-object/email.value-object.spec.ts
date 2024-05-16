import { EmailValueObject } from './email.value-object';

describe('EmailValueObject', () => {
  describe('create', () => {
    it('should create an EmailValueObject from a valid email', () => {
      // Arrange
      const email = 'test@example.com';

      // Act
      const instance = EmailValueObject.create(email);

      // Assert
      expect(instance.value).toBe(email);
    });

    it('should throw an error when the email is invalid', () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act
      const create = () => EmailValueObject.create(invalidEmail);

      // Act & Assert
      expect(create).toThrow('Invalid email address.');
    });
  });
});
