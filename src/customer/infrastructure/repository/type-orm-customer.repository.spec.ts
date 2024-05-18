import { Repository } from 'typeorm';
import { TypeOrmCustomerRepository } from './type-orm-customer.repository';
import { CustomerEntity as InfrastructureCustomerEntity } from '../entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { CustomerEntity as DomainCustomerEntity } from '@/customer/domain/entity/customer.entity';
import {
  getDomainEssentialCustomerEntityProps,
  getInfrastructureCustomerEntity,
  getInfrastructureEssentialCustomerEntityProps,
  getValidCpf,
} from '@/testing/customer/helpers';
import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { getTypeOrmRepositoryMock } from '@/testing/shared/mock/type-orm.repository.mock';
import { getEntityIdGeneratorHelperMock } from '@/testing/shared/mock/entity-id-generator.helper.mock';

describe('TypeOrmCustomerRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructureCustomerEntity>>;
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: TypeOrmCustomerRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructureCustomerEntity>();
    repositoryMock = mocks.repositoryMock;
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new TypeOrmCustomerRepository(entityIdGeneratorMock, repositoryMock);
  });

  describe('findByCpf', () => {
    it('should return a customer entity when a valid CPF is provided', async () => {
      // Arrange
      const dbEntity = getInfrastructureCustomerEntity();
      const cpf = CpfValueObject.create(dbEntity.cpf);
      repositoryMock.findOneBy.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findByCpf(cpf);

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ cpf: cpf.value });
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
      const dbEntityProps = getInfrastructureEssentialCustomerEntityProps();
      const dbEntity = getInfrastructureCustomerEntity(dbEntityProps);
      entityIdGeneratorMock.generate.mockReturnValue(
        EntityIdValueObject.create(dbEntity.id),
      );
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.create(customerProps);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntityProps);
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
      const dbEntity = getInfrastructureCustomerEntity({
        id: 'customer-id',
        name: null,
        email: null,
        cpf: null,
      });
      entityIdGeneratorMock.generate.mockReturnValue(
        EntityIdValueObject.create(dbEntity.id),
      );
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
      expect(repositoryMock.existsBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.existsBy).toHaveBeenCalledWith({ cpf: cpf.value });
      expect(result).toBe(expectedBoolean);
    });
  });
});
