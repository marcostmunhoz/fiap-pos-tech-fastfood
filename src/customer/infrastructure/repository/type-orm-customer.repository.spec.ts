import { Repository } from 'typeorm';
import { TypeOrmCustomerRepository } from './type-orm-customer.repository';
import { CustomerEntity as InfrastructureCustomerEntity } from '../entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { CustomerEntity as DomainCustomerEntity } from '@/customer/domain/entity/customer.entity';
import {
  getCustomerDomainEntityProps,
  getCustomerInfrastructureEntity,
  getValidCpf,
} from '@/testing/customer/helpers';

describe('TypeOrmCustomerRepository', () => {
  let repository: jest.Mocked<Repository<InfrastructureCustomerEntity>>;
  let sut: TypeOrmCustomerRepository;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<Repository<InfrastructureCustomerEntity>>;
    sut = new TypeOrmCustomerRepository(repository);
  });

  describe('findByCpf', () => {
    it('should return a customer entity when a valid CPF is provided', async () => {
      // Arrange
      const dbEntity = getCustomerInfrastructureEntity();
      const cpf = CpfValueObject.create(dbEntity.cpf);
      repository.findOne.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findByCpf(cpf);

      // Assert
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainCustomerEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.email.value).toBe(dbEntity.email);
      expect(result.cpf.value).toBe(dbEntity.cpf);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should return null when an invalid CPF is provided', async () => {
      // Arrange
      const cpf = getValidCpf();
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await sut.findByCpf(cpf);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new customer entity', async () => {
      // Arrange
      const customerProps = getCustomerDomainEntityProps();
      const dbEntity = getCustomerInfrastructureEntity({
        name: customerProps.name.value,
        email: customerProps.email.value,
        cpf: customerProps.cpf.value,
      });
      repository.create.mockReturnValue(dbEntity);
      repository.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.create(customerProps);

      // Assert
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainCustomerEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.email.value).toBe(dbEntity.email);
      expect(result.cpf.value).toBe(dbEntity.cpf);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });
});
