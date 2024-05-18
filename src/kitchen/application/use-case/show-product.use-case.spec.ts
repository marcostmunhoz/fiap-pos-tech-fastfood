import { ShowProductUseCase } from './show-product.use-case';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import {
  getDomainProductEntity,
  getValidProductEntityId,
} from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';

describe('ShowProductUseCase', () => {
  let sut: ShowProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new ShowProductUseCase(repository);
  });

  describe('execute', () => {
    it('should return an existing product', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      repository.findById.mockResolvedValue(entity);

      // Act
      await sut.execute({ id: entity.id });

      // Assert
      expect(repository.findById).toHaveBeenCalledTimes(1);
      expect(repository.findById).toHaveBeenCalledWith(entity.id);
    });

    it('should throw an error when a product with the given code already exists', async () => {
      // Arrange
      const id = getValidProductEntityId();
      repository.findById.mockResolvedValue(null);

      // Act
      const result = sut.execute({ id });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException('Product not found with given ID.'),
      );
    });
  });
});
