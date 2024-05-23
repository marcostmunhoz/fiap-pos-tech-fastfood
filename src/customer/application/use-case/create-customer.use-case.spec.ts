import { CustomerEntity } from '@/customer/domain/entity/customer.entity';
import { CustomerFactory } from '@/customer/domain/factory/customer.factory';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import {
  getDomainCustomerEntity,
  getDomainPartialCustomerEntityProps,
  getValidCustomerEntityId,
} from '@/testing/customer/helpers';
import { getCustomerFactoryMock } from '@/testing/customer/mock/customer.factory.mock';
import { getCustomerRepositoryMock } from '@/testing/customer/mock/customer.repository.mock';
import { CreateCustomerUseCase } from './create-customer.use-case';

describe('CreateCustomerUseCase', () => {
  let factoryMock: jest.Mocked<CustomerFactory>;
  let repositoryMock: jest.Mocked<CustomerRepository>;
  let sut: CreateCustomerUseCase;

  beforeEach(() => {
    factoryMock = getCustomerFactoryMock();
    repositoryMock = getCustomerRepositoryMock();
    sut = new CreateCustomerUseCase(factoryMock, repositoryMock);
  });

  describe('execute', () => {
    it('should create a new customer when the given CPF does not exists', async () => {
      // Arrange
      const props = getDomainPartialCustomerEntityProps();
      const entity = getDomainCustomerEntity(props);
      const output = {
        id: entity.id,
        name: entity.name,
      };
      repositoryMock.existsWithCpf.mockResolvedValue(false);
      factoryMock.createCustomer.mockReturnValue(entity);
      repositoryMock.save.mockResolvedValue(entity);

      // Act
      const result = await sut.execute(props);

      // Assert
      expect(factoryMock.createCustomer).toHaveBeenCalledTimes(1);
      expect(factoryMock.createCustomer).toHaveBeenCalledWith(props);
      expect(repositoryMock.existsWithCpf).toHaveBeenCalledTimes(1);
      expect(repositoryMock.existsWithCpf).toHaveBeenCalledWith(props.cpf);
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(output);
    });

    it('should create a new customer without optional fields', async () => {
      // Arrange
      const entity = new CustomerEntity({
        id: getValidCustomerEntityId(),
        name: null,
        email: null,
        cpf: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const output = {
        id: entity.id,
        name: null,
      };
      factoryMock.createCustomer.mockReturnValue(entity);
      repositoryMock.save.mockResolvedValue(entity);

      // Act
      const result = await sut.execute({});

      // Assert
      expect(result).toEqual(output);
      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
    });

    it('should throw an error when a customer with the given CPF already exists', async () => {
      // Arrange
      const props = getDomainPartialCustomerEntityProps();
      repositoryMock.existsWithCpf.mockResolvedValue(true);

      // Act
      const act = () => sut.execute(props);

      // Assert
      expect(act).rejects.toThrow(
        new EntityAlreadyExistsException(
          'Customer already exists with given CPF.',
        ),
      );
    });
  });
});
