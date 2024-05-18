import { Repository } from 'typeorm';
import { TypeOrmCustomerRepository } from './type-orm-customer.repository';
import { CustomerEntity as InfrastructureCustomerEntity } from '../entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { CustomerEntity as DomainCustomerEntity } from '@/customer/domain/entity/customer.entity';
import {
  getDomainEssentialCustomerEntityProps,
  getCustomerInfrastructureEntity,
  getValidCpf,
} from '@/testing/customer/helpers';
import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';

describe('TypeOrmCustomerRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructureCustomerEntity>>;
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: TypeOrmCustomerRepository;

  beforeEach(() => {
    repositoryMock = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      existsBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<InfrastructureCustomerEntity>>;
    entityIdGeneratorMock = {
      generate: jest.fn(),
    } as jest.Mocked<EntityIdGeneratorHelper>;
    sut = new TypeOrmCustomerRepository(entityIdGeneratorMock, repositoryMock);
  });

  describe('findByCpf', () => {
    it('should return a customer entity when a valid CPF is provided', async () => {
      // Arrange
      const dbEntity = getCustomerInfrastructureEntity();
      const cpf = CpfValueObject.create(dbEntity.cpf);
      repositoryMock.findOneBy.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findByCpf(cpf);

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
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
      repositoryMock.findOneBy.mockResolvedValue(null);

      // Act
      const result = await sut.findByCpf(cpf);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new customer entity', async () => {
      // Arrange
      const customerProps = getDomainEssentialCustomerEntityProps();
      const dbEntity = getCustomerInfrastructureEntity({
        id: 'customer-id',
        name: customerProps.name.value,
        email: customerProps.email.value,
        cpf: customerProps.cpf.value,
      });
      entityIdGeneratorMock.generate.mockReturnValue(
        EntityIdValueObject.create(dbEntity.id),
      );
      repositoryMock.create.mockReturnValue(dbEntity);
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.create(customerProps);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalled();
      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainCustomerEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.email.value).toBe(dbEntity.email);
      expect(result.cpf.value).toBe(dbEntity.cpf);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should create a new customer entity without optional fields', async () => {
      // Arrange
      const dbEntity = getCustomerInfrastructureEntity({
        id: 'customer-id',
        name: null,
        email: null,
        cpf: null,
      });
      entityIdGeneratorMock.generate.mockReturnValue(
        EntityIdValueObject.create(dbEntity.id),
      );
      repositoryMock.create.mockReturnValue(dbEntity);
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.create({});

      // Assert
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.name).toBeNull();
      expect(result.email).toBeNull();
      expect(result.cpf).toBeNull();
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });

  describe('existsWithCpf', () => {
    it('should return a boolean indicating whether when a customer with the provided CPF exists', async () => {
      // Arrange
      const cpf = getValidCpf();
      const expectedBoolean = true;
      repositoryMock.existsBy.mockResolvedValue(expectedBoolean);

      // Act
      const result = await sut.existsWithCpf(cpf);

      // Assert
      expect(result).toBe(expectedBoolean);
    });
  });
});
