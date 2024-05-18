import { CreateProductUseCase, Output } from './create-product.use-case';
import { ProductEntityPropsWithId } from '@/shared/domain/entity/product.entity';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { getDomainEssentialProductEntityProps } from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';

describe('CreateProductUseCase', () => {
  let sut: CreateProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new CreateProductUseCase(repository);
  });

  describe('execute', () => {
    it('should create a new product when the given code does not exist', async () => {
      // Arrange
      const props = getDomainEssentialProductEntityProps();
      const propsWithId: ProductEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        ...props,
      };
      const output: Output = propsWithId;
      repository.create.mockResolvedValue(propsWithId);
      repository.existsWithCode.mockResolvedValue(false);

      // Act
      const result = await sut.execute(props);

      // Assert
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(props);
      expect(repository.existsWithCode).toHaveBeenCalledTimes(1);
      expect(repository.existsWithCode).toHaveBeenCalledWith(props.code);
      expect(result).toEqual(output);
    });

    it('should throw an error when a product with the given code already exists', async () => {
      // Arrange
      const props = getDomainEssentialProductEntityProps();
      repository.existsWithCode.mockResolvedValue(true);

      // Act
      const result = sut.execute(props);

      // Assert
      expect(result).rejects.toThrow(
        new EntityAlreadyExistsException(
          'Product already exists with given code.',
        ),
      );
    });
  });
});
