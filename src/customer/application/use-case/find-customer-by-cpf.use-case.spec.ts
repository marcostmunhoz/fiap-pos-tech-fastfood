import { FindCustomerByCpfUseCase } from './find-customer-by-cpf.use-case';
import { CustomerEntityPropsWithId } from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';

describe('FindCustomerByCpfUseCase', () => {
  let sut: FindCustomerByCpfUseCase;
  let repository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    repository = {
      findByCpf: jest.fn(),
      create: jest.fn(),
    };
    sut = new FindCustomerByCpfUseCase(repository);
  });

  describe('execute', () => {
    it('should return the customer when found', async () => {
      // Arrange
      const cpf = CpfValueObject.create('57516713090');
      const customer: CustomerEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        fullName: FullNameValueObject.createFromFullName('John Doe'),
        cpf,
        email: EmailValueObject.create('john.doe@example.com'),
      };
      repository.findByCpf.mockResolvedValue(customer);

      // Act
      const result = await sut.execute({ cpf });

      // Assert
      expect(result).toEqual(customer);
      expect(repository.findByCpf).toHaveBeenCalledWith(cpf);
    });

    it('should return null when customer is not found', async () => {
      // Arrange
      const cpf = CpfValueObject.create('57516713090');
      repository.findByCpf.mockResolvedValue(null);

      // Act
      const result = await sut.execute({ cpf });

      // Assert
      expect(result).toBeNull();
      expect(repository.findByCpf).toHaveBeenCalledWith(cpf);
    });
  });
});
