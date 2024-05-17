import { CreateCustomerUseCase } from './create-customer.use-case';
import { CustomerEntityPropsWithId } from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { getDomainEssentialCustomerEntityProps } from '@/testing/customer/helpers';

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
      const props = getDomainEssentialCustomerEntityProps();
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
