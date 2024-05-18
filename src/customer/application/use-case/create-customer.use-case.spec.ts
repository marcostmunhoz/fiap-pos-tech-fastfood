import { CreateCustomerUseCase } from './create-customer.use-case';
import { CustomerEntityPropsWithId } from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { getDomainEssentialCustomerEntityProps } from '@/testing/customer/helpers';
import { getCustomerRepositoryMock } from '@/testing/customer/mock/customer.repository.mock';

describe('CreateCustomerUseCase', () => {
  let sut: CreateCustomerUseCase;
  let repository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    repository = getCustomerRepositoryMock();
    sut = new CreateCustomerUseCase(repository);
  });

  describe('execute', () => {
    it('should create a new customer when the given CPF does not exists', async () => {
      // Arrange
      const props = getDomainEssentialCustomerEntityProps();
      const propsWithId: CustomerEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        ...props,
      };
      const output = {
        id: propsWithId.id,
        name: props.name,
      };
      repository.create.mockResolvedValue(propsWithId);
      repository.existsWithCpf.mockResolvedValue(false);

      // Act
      const result = await sut.execute(props);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(props);
      expect(repository.existsWithCpf).toHaveBeenCalledWith(props.cpf);
      expect(result).toEqual(output);
    });

    it('should create a new customer without optional fields', async () => {
      // Arrange
      const propsWithId: CustomerEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        name: null,
        email: null,
        cpf: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const output = {
        id: propsWithId.id,
        name: null,
      };
      repository.create.mockResolvedValue(propsWithId);

      // Act
      const result = await sut.execute({});

      // Assert
      expect(result).toEqual(output);
      expect(repository.create).toHaveBeenCalledWith({});
    });

    it('should throw an error when a customer with the given CPF already exists', async () => {
      // Arrange
      const props = getDomainEssentialCustomerEntityProps();
      repository.existsWithCpf.mockResolvedValue(true);

      // Act
      const result = sut.execute(props);

      // Assert
      await expect(result).rejects.toThrow(
        new EntityAlreadyExistsException(
          'Customer already exists with given CPF.',
        ),
      );
    });
  });
});
