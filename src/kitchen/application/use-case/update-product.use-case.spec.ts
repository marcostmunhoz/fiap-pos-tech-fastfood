import { UpdateProductUseCase, Output, Input } from './update-product.use-case';
import { ProductEntity } from '@/shared/domain/entity/product.entity';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import {
  getDomainEssentialProductEntityProps,
  getDomainProductEntity,
  getValidProductEntityId,
} from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';

describe('UpdateProductUseCase', () => {
  let sut: UpdateProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new UpdateProductUseCase(repository);
  });

  describe('execute', () => {
    it('should update an existing product when the given id exists', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const input: Input = {
        id: entity.id,
        data: {
          code: ProductCodeValueObject.create('NEWCODE'),
          name: ProductNameValueObject.create('New product name'),
          category: ProductCategoryEnum.DRINK,
          price: MoneyValueObject.create(100),
        },
      };
      const updatedEntity = ProductEntity.create({
        id: entity.id,
        ...input.data,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
      repository.findById.mockResolvedValue(entity);
      repository.update.mockResolvedValue(updatedEntity);

      // Act
      await sut.execute(input);

      // Assert
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(updatedEntity);
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(entity.id);
    });

    it('should throw an error when the given id does not exist', async () => {
      // Arrange
      const props = getDomainEssentialProductEntityProps();
      const entity = ProductEntity.create({
        id: getValidProductEntityId(),
        ...props,
      });
      repository.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute({ id: entity.id, data: props });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException('Product not found with given ID.'),
      );
    });

    it('should throw an error when another product already exists with the given code', async () => {
      // Arrange
      const props = getDomainEssentialProductEntityProps();
      const entity = ProductEntity.create({
        id: getValidProductEntityId(),
        ...props,
      });
      repository.findById.mockResolvedValue(entity);
      repository.existsWithCode.mockResolvedValue(true);

      // Act
      const result = sut.execute({ id: entity.id, data: props });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException(
          'Another product already exists with given code.',
        ),
      );
    });
  });
});
