import { ProductEntity } from '@/shared/domain/entity/product.entity';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductDescriptionValueObject } from '@/shared/domain/value-object/product-description.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import {
  getDomainPartialProductEntityProps,
  getDomainProductEntity,
} from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { Input, UpdateProductUseCase } from './update-product.use-case';

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
      const expectedDate = new Date();
      // forces the date constructor to always return the same value, preventing failed tests because of the
      // changed updatedAt
      jest.spyOn(global, 'Date').mockImplementation(() => expectedDate);
      const entity = getDomainProductEntity();
      const input: Input = {
        id: entity.id,
        data: {
          code: ProductCodeValueObject.create('NEWCODE'),
          description: ProductDescriptionValueObject.create(
            'New product description',
          ),
          name: ProductNameValueObject.create('New product name'),
          category: ProductCategoryEnum.DRINK,
          price: MoneyValueObject.create(100),
        },
      };
      const updatedEntity = new ProductEntity({
        id: entity.id,
        ...input.data,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
      repository.findById.mockResolvedValue(entity);
      repository.save.mockResolvedValue(updatedEntity);

      // Act
      await sut.execute(input);

      // Assert
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(entity.id);
      expect(repository.existsWithCode).toHaveBeenCalledTimes(1);
      expect(repository.existsWithCode).toHaveBeenCalledWith(
        input.data.code,
        entity.id,
      );
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(updatedEntity);
    });

    it('should throw an error when the given id does not exist', async () => {
      // Arrange
      const props = getDomainPartialProductEntityProps();
      const entity = getDomainProductEntity(props);
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
      const props = getDomainPartialProductEntityProps();
      const entity = getDomainProductEntity(props);
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
