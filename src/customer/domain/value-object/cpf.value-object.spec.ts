import { CpfValueObject } from './cpf.value-object';

describe('CpfValueObject', () => {
  describe('create', () => {
    it('should create a valid CpfValueObject instance', () => {
      // Arrange
      const cpf = '57516713090';

      // Act
      const instance = CpfValueObject.create(cpf);

      // Assert
      expect(instance).toBeInstanceOf(CpfValueObject);
      expect(instance.value).toBe(cpf);
    });

    it('should throw an error for an invalid CPF', () => {
      // Arrange
      const cpf = '00000000000';

      // Act
      const create = () => CpfValueObject.create(cpf);

      // Assert
      expect(create).toThrow('Invalid CPF.');
    });
  });
});
