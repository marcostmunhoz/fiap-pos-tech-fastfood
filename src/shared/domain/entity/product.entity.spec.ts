import { ProductEntity } from './product.entity';
import { getDomainProductEntityPropsWithId } from '@/testing/shared/helpers';

describe('ProductEntity', () => {
  describe('create', () => {
    it('should return a new Product instance', async () => {
      // Arrange
      const props = getDomainProductEntityPropsWithId();

      // Act
      const result = ProductEntity.create(props);

      // Assert
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result).toEqual(props);
    });
  });
});
