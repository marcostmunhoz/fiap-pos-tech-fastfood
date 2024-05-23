import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import {
  getDomainPartialProductEntityProps,
  getValidProductEntityId,
} from '@/testing/shared/helpers';
import { getEntityIdGeneratorHelperMock } from '@/testing/shared/mock/entity-id-generator.helper.mock';
import { ProductEntity } from '../entity/product.entity';
import { ProductFactory } from './product.factory';

describe('ProductFactory', () => {
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: ProductFactory;

  beforeEach(() => {
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new ProductFactory(entityIdGeneratorMock);
  });

  describe('createProduct', () => {
    it('should create an instance of the product entity', () => {
      // Arrange
      const props = getDomainPartialProductEntityProps();
      const id = getValidProductEntityId();
      entityIdGeneratorMock.generate.mockReturnValue(id);
      const expectedDate = new Date();
      const dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => expectedDate);

      // Act
      const entity = sut.createProduct(props);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(dateSpy).toHaveBeenCalledTimes(2);
      expect(entity).toBeInstanceOf(ProductEntity);
      expect(entity.id).toEqual(id);
      expect(entity.code).toEqual(props.code);
      expect(entity.name).toEqual(props.name);
      expect(entity.category).toEqual(props.category);
      expect(entity.price).toEqual(props.price);
      expect(entity.createdAt).toEqual(expectedDate);
      expect(entity.updatedAt).toEqual(expectedDate);
    });
  });
});
