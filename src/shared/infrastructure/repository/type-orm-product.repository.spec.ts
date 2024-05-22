import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { TypeOrmProductRepository } from './type-orm-product.repository';
import { ProductEntity as InfrastructureProductEntity } from '../entity/product.entity';
import { ProductEntity as DomainProductEntity } from '@/shared/domain/entity/product.entity';
import {
  getDomainEssentialProductEntityProps,
  getDomainProductEntity,
  getInfrastructureEssentialProductEntityProps,
  getInfrastructureProductEntity,
  getValidProductCode,
  getValidProductEntityId,
} from '@/testing/shared/helpers';
import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { getTypeOrmRepositoryMock } from '@/testing/shared/mock/type-orm.repository.mock';
import { getEntityIdGeneratorHelperMock } from '@/testing/shared/mock/entity-id-generator.helper.mock';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { SearchProductQuery } from '@/shared/domain/repository/product.repository.interface';

describe('TypeOrmProductRepository', () => {
  let queryBuilderMock: jest.Mocked<
    SelectQueryBuilder<InfrastructureProductEntity>
  >;
  let repositoryMock: jest.Mocked<Repository<InfrastructureProductEntity>>;
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: TypeOrmProductRepository;

  beforeEach(() => {
    const mocks = getTypeOrmRepositoryMock<InfrastructureProductEntity>();
    repositoryMock = mocks.repositoryMock;
    queryBuilderMock = mocks.queryBuilderMock;
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new TypeOrmProductRepository(entityIdGeneratorMock, repositoryMock);
  });

  describe('list', () => {
    it('should return an array of existing products', async () => {
      // Arrange
      const dbEntity = getInfrastructureProductEntity();
      repositoryMock.find.mockResolvedValue([dbEntity]);

      // Act
      const result = await sut.list();

      // Assert
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(DomainProductEntity);
      expect(result[0].id.value).toBe(dbEntity.id);
      expect(result[0].code.value).toBe(dbEntity.code);
      expect(result[0].name.value).toBe(dbEntity.name);
      expect(result[0].price.value).toBe(dbEntity.price);
      expect(result[0].category).toBe(dbEntity.category);
      expect(result[0].createdAt).toBe(dbEntity.createdAt);
      expect(result[0].updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should return an empty array when no product exists', async () => {
      // Arrange
      repositoryMock.find.mockResolvedValue([]);

      // Act
      const result = await sut.list();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('search', () => {
    it('should not filter by any parameter when no filter is provided', async () => {
      // Arrange
      const dbEntity = getInfrastructureProductEntity();
      queryBuilderMock.getMany.mockResolvedValue([dbEntity]);

      // Act
      const result = await sut.search({});

      // Assert
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).not.toHaveBeenCalled();
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result[0]).toBeInstanceOf(DomainProductEntity);
      expect(result[0].id.value).toBe(dbEntity.id);
      expect(result[0].code.value).toBe(dbEntity.code);
      expect(result[0].name.value).toBe(dbEntity.name);
      expect(result[0].price.value).toBe(dbEntity.price);
      expect(result[0].category).toBe(dbEntity.category);
      expect(result[0].createdAt).toBe(dbEntity.createdAt);
      expect(result[0].updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should filter by query when a query is provided', async () => {
      // Arrange
      const query = 'product';
      repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);
      queryBuilderMock.getMany.mockResolvedValue([]);

      // Act
      await sut.search({ query });

      // Assert
      expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(expect.any(Brackets));
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
    });

    it('should filter by category when a category is provided', async () => {
      // Arrange
      const category = ProductCategoryEnum.FOOD;
      repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);
      queryBuilderMock.getMany.mockResolvedValue([]);

      // Act
      await sut.search({ category });

      // Assert
      expect(queryBuilderMock.where).not.toHaveBeenCalled();
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'products.category = :c',
        { c: category },
      );
    });

    it('should filter by query and category when both are provided', async () => {
      // Arrange
      const query: SearchProductQuery = {
        query: 'product',
        category: ProductCategoryEnum.FOOD,
      };
      repositoryMock.createQueryBuilder.mockReturnValue(queryBuilderMock);
      queryBuilderMock.getMany.mockResolvedValue([]);

      // Act
      await sut.search(query);

      // Assert
      expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).toHaveBeenCalledWith(expect.any(Brackets));
      expect(queryBuilderMock.andWhere).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'products.category = :c',
        { c: query.category },
      );
    });
  });

  describe('findById', () => {
    it('should return a product entity when a product with the provided ID exists', async () => {
      // Arrange
      const dbEntity = getInfrastructureProductEntity();
      repositoryMock.findOneBy.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.findById(
        EntityIdValueObject.create(dbEntity.id),
      );

      // Assert
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
        id: dbEntity.id,
      });
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainProductEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.code.value).toBe(dbEntity.code);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.price.value).toBe(dbEntity.price);
      expect(result.category).toBe(dbEntity.category);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });

    it('should return null when no product with the provided ID exists', async () => {
      // Arrange
      const id = getValidProductEntityId();
      repositoryMock.findOneBy.mockResolvedValue(null);

      // Act
      const result = await sut.findById(id);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new product entity', async () => {
      // Arrange
      const productProps = getDomainEssentialProductEntityProps();
      const dbEntityProps = getInfrastructureEssentialProductEntityProps();
      const dbEntity = getInfrastructureProductEntity(dbEntityProps);
      entityIdGeneratorMock.generate.mockReturnValue(
        EntityIdValueObject.create(dbEntity.id),
      );
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.create(productProps);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntityProps);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainProductEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.code.value).toBe(dbEntity.code);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.price.value).toBe(dbEntity.price);
      expect(result.category).toBe(dbEntity.category);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });

  describe('updated', () => {
    it('should update a product entity', async () => {
      // Arrange
      const domainEntity = getDomainProductEntity();
      const dbEntity = getInfrastructureProductEntity({
        id: domainEntity.id.value,
        code: domainEntity.code.value,
        name: domainEntity.name.value,
        price: domainEntity.price.value,
        category: domainEntity.category,
      });
      repositoryMock.save.mockResolvedValue(dbEntity);

      // Act
      const result = await sut.update(domainEntity);

      // Assert
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(dbEntity);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DomainProductEntity);
      expect(result.id.value).toBe(dbEntity.id);
      expect(result.code.value).toBe(dbEntity.code);
      expect(result.name.value).toBe(dbEntity.name);
      expect(result.price.value).toBe(dbEntity.price);
      expect(result.category).toBe(dbEntity.category);
      expect(result.createdAt).toBe(dbEntity.createdAt);
      expect(result.updatedAt).toBe(dbEntity.updatedAt);
    });
  });

  describe('delete', () => {
    it('should delete a product entity', async () => {
      // Arrange
      const id = getValidProductEntityId();

      // Act
      await sut.delete(id);

      // Assert
      expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(repositoryMock.delete).toHaveBeenCalledWith({ id: id.value });
    });
  });

  describe('existsWithCode', () => {
    it('should return a boolean indicating whether when a product with the provided code exists', async () => {
      // Arrange
      const code = getValidProductCode();
      const expectedBoolean = true;
      repositoryMock.exists.mockResolvedValue(expectedBoolean);

      // Act
      const result = await sut.existsWithCode(code);

      // Assert
      expect(repositoryMock.exists).toHaveBeenCalledTimes(1);
      expect(repositoryMock.exists).toHaveBeenCalledWith({
        where: {
          code: code.value,
        },
      });
      expect(result).toBe(expectedBoolean);
    });

    it('should ignore the provided id', async () => {
      // Arrange
      const id = getValidProductEntityId();
      const code = getValidProductCode();
      const expectedBoolean = true;
      repositoryMock.exists.mockResolvedValue(expectedBoolean);

      // Act
      const result = await sut.existsWithCode(code, id);

      // Assert
      expect(repositoryMock.exists).toHaveBeenCalledTimes(1);
      expect(repositoryMock.exists).toHaveBeenCalledWith({
        where: {
          id: Not(id.value),
          code: code.value,
        },
      });
      expect(result).toBe(expectedBoolean);
    });
  });

  describe('existsWithId', () => {
    it('should return a boolean indicating whether when a product with the provided id exists', async () => {
      // Arrange
      const id = getValidProductEntityId();
      const expectedBoolean = true;
      repositoryMock.existsBy.mockResolvedValue(expectedBoolean);

      // Act
      const result = await sut.existsWithId(id);

      // Assert
      expect(repositoryMock.existsBy).toHaveBeenCalledTimes(1);
      expect(repositoryMock.existsBy).toHaveBeenCalledWith({ id: id.value });
      expect(result).toBe(expectedBoolean);
    });
  });
});
