import {
  Input,
  Output,
  SearchProductsUseCase,
} from './search-products.use-case';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import {
  getDomainProductEntity,
  getValidProductEntityId,
} from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';

describe('SearchProductsUseCase', () => {
  let sut: SearchProductsUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new SearchProductsUseCase(repository);
  });

  describe('execute', () => {
    it('should return the filtered products', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const input: Input = {
        query: entity.name.value,
        category: entity.category,
      };
      const output: Output = [entity];
      repository.search.mockResolvedValue([entity]);

      // Act
      const result = await sut.execute(input);

      // Assert
      expect(repository.search).toHaveBeenCalledTimes(1);
      expect(repository.search).toHaveBeenCalledWith(input);
      expect(result).toEqual(output);
    });
  });
});
