import { CreateCustomerUseCase } from './create-customer.use-case';
import {
  CustomerEntityProps,
  CustomerEntityPropsWithId,
} from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';

describe('CreateCustomerUseCase', () => {
  let sut: CreateCustomerUseCase;
  let repository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByCpf: jest.fn(),
    };
    sut = new CreateCustomerUseCase(repository);
  });

  describe('execute', () => {
    it('should create a new customer', async () => {
      // Arrange
      const props: CustomerEntityProps = {
        fullName: FullNameValueObject.createFromFullName('John Doe'),
        cpf: CpfValueObject.create('57516713090'),
        email: EmailValueObject.create('john.doe@example.com'),
      };
      const propsWithId: CustomerEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        ...props,
      };
      repository.create.mockResolvedValue(propsWithId);

      // Act
      const result = await sut.execute(props);

      // Assert
      expect(result).toEqual(propsWithId);
      expect(repository.create).toHaveBeenCalledWith(props);
    });
  });
});
