import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { getValidProductEntityId } from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { DeleteProductUseCase } from './delete-product.use-case';

describe('DeleteProductUseCase', () => {
  let sut: DeleteProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new DeleteProductUseCase(repository);
  });

  describe('execute', () => {
    it('should delete an existing product', async () => {
      // Arrange
      const id = getValidProductEntityId();
      repository.existsWithId.mockResolvedValue(true);

      // Act
      await sut.execute({ id });

      // Assert
      expect(repository.existsWithId).toHaveBeenCalledTimes(1);
      expect(repository.existsWithId).toHaveBeenCalledWith(id);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw an error when a product with the given code already exists', async () => {
      // Arrange
      const id = getValidProductEntityId();
      repository.existsWithId.mockResolvedValue(false);

      // Act
      const result = sut.execute({ id });

      // Assert
      expect(result).rejects.toThrow(
        new EntityNotFoundException('Product not found with given ID.'),
      );
    });
  });
});
