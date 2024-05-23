import { CustomerEntity as DomainCustomerEntity } from '@/customer/domain/entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import {
  getDomainCustomerEntity,
  getInfrastructureCustomerEntity,
  getValidCpf,
  getValidCustomerEntityId,
} from '@/testing/customer/helpers';
import { getTypeOrmRepositoryMock } from '@/testing/shared/mock/type-orm.repository.mock';
import { Repository } from 'typeorm';
import { CustomerEntity as InfrastructureCustomerEntity } from '../entity/customer.entity';
import { TypeOrmCustomerRepository } from './type-orm-customer.repository';

describe('TypeOrmCustomerRepository', () => {
  let repositoryMock: jest.Mocked<Repository<InfrastructureCustomerEntity>>;
  let sut: TypeOrmCustomerRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructureCustomerEntity>();
    repositoryMock = mocks.repositoryMock;
    sut = new TypeOrmCustomerRepository(repositoryMock);
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

  describe('save', () => {
    it('should save the entity', async () => {
      // Arrange
      const entity = getDomainCustomerEntity();
      const dbEntity = getInfrastructureCustomerEntity(entity);
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

      // Assert
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntity);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainCustomerEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.email.value).toBe(dbEntity.email);
      expect(result.cpf.value).toBe(dbEntity.cpf);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should save the entity without optional fields', async () => {
      // Arrange
      const entity = new DomainCustomerEntity({
        id: getValidCustomerEntityId(),
        name: null,
        email: null,
        cpf: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const dbEntity: InfrastructureCustomerEntity = {
        id: entity.id.value,
        name: null,
        email: null,
        cpf: null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.save(entity);

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
