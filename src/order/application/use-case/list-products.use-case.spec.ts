import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductDescriptionValueObject } from '@/shared/domain/value-object/product-description.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import { getDomainProductEntity } from '@/testing/shared/helpers';
import { getProductRepositoryMock } from '@/testing/shared/mock/product.repository.mock';
import { ListProductsUseCase } from './list-products.use-case';

describe('ListProductsUseCase', () => {
  let sut: ListProductsUseCase;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repository = getProductRepositoryMock();
    sut = new ListProductsUseCase(repository);
  });

  describe('execute', () => {
    it('should return the filtered products', async () => {
      // Arrange
      const product1 = getDomainProductEntity({
        code: ProductCodeValueObject.create('product-code-1'),
        name: ProductNameValueObject.create('Product 1'),
        description: ProductDescriptionValueObject.create(
          'Product Description 1',
        ),
        price: MoneyValueObject.create(100),
        category: ProductCategoryEnum.DESSERT,
      });
      const product2 = getDomainProductEntity({
        code: ProductCodeValueObject.create('product-code-2'),
        name: ProductNameValueObject.create('Product 2'),
        description: ProductDescriptionValueObject.create(
          'Product Description 2',
        ),
        price: MoneyValueObject.create(200),
        category: ProductCategoryEnum.DRINK,
      });
      const product3 = getDomainProductEntity({
        code: ProductCodeValueObject.create('product-code-3'),
        name: ProductNameValueObject.create('Product 3'),
        description: ProductDescriptionValueObject.create(
          'Product Description 3',
        ),
        price: MoneyValueObject.create(300),
        category: ProductCategoryEnum.FOOD,
      });
      const product4 = getDomainProductEntity({
        code: ProductCodeValueObject.create('product-code-4'),
        name: ProductNameValueObject.create('Product 4'),
        description: ProductDescriptionValueObject.create(
          'Product Description 4',
        ),
        price: MoneyValueObject.create(400),
        category: ProductCategoryEnum.FOOD,
      });
      const product5 = getDomainProductEntity({
        code: ProductCodeValueObject.create('product-code-5'),
        name: ProductNameValueObject.create('Product 5'),
        description: ProductDescriptionValueObject.create(
          'Product Description 5',
        ),
        price: MoneyValueObject.create(500),
        category: ProductCategoryEnum.SIDE,
      });
      repository.list.mockResolvedValue([
        product1,
        product2,
        product3,
        product4,
        product5,
      ]);

      // Act
      const result = await sut.execute();

      // Assert
      expect(repository.list).toHaveBeenCalledTimes(1);
      expect(repository.list).toHaveBeenCalledWith();
      expect(result).toHaveLength(4);
      expect(result[0].category).toEqual(ProductCategoryEnum.DESSERT);
      expect(result[0].products).toHaveLength(1);
      expect(result[0].products[0]).toEqual({
        code: product1.code.value,
        name: product1.name.value,
        description: product1.description.value,
        price: product1.price.valueAsFloat,
      });
      expect(result[1].category).toEqual(ProductCategoryEnum.DRINK);
      expect(result[1].products).toHaveLength(1);
      expect(result[1].products[0]).toEqual({
        code: product2.code.value,
        name: product2.name.value,
        description: product2.description.value,
        price: product2.price.valueAsFloat,
      });
      expect(result[2].category).toEqual(ProductCategoryEnum.FOOD);
      expect(result[2].products).toHaveLength(2);
      expect(result[2].products[0]).toEqual({
        code: product3.code.value,
        name: product3.name.value,
        description: product3.description.value,
        price: product3.price.valueAsFloat,
      });
      expect(result[2].products[1]).toEqual({
        code: product4.code.value,
        name: product4.name.value,
        description: product4.description.value,
        price: product4.price.valueAsFloat,
      });
      expect(result[3].category).toEqual(ProductCategoryEnum.SIDE);
      expect(result[3].products).toHaveLength(1);
      expect(result[3].products[0]).toEqual({
        code: product5.code.value,
        name: product5.name.value,
        description: product5.description.value,
        price: product5.price.valueAsFloat,
      });
    });
  });
});
