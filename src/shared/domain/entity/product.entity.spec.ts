import {
  getDomainCompleteProductEntityProps,
  getDomainProductEntity,
} from '@/testing/shared/helpers';
import { ProductCategoryEnum } from '../enum/product-category.enum';
import { MoneyValueObject } from '../value-object/money.value-object';
import { ProductCodeValueObject } from '../value-object/product-code.value-object';
import { ProductDescriptionValueObject } from '../value-object/product-description.value-object';
import { ProductNameValueObject } from '../value-object/product-name.value-object';

describe('ProductEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getDomainCompleteProductEntityProps();
      const entity = getDomainProductEntity(props);

      // Assert
      expect(entity.id).toEqual(props.id);
      expect(entity.code).toEqual(props.code);
      expect(entity.name).toEqual(props.name);
      expect(entity.description).toEqual(props.description);
      expect(entity.category).toEqual(props.category);
      expect(entity.price).toEqual(props.price);
      expect(entity.createdAt).toEqual(props.createdAt);
      expect(entity.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('setCode', () => {
    it('sets the code and touches updatedAt', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const newCode = ProductCodeValueObject.create('NEWCODE');
      const markAsUpdatedSpy = jest.spyOn(entity as any, 'markAsUpdated');

      // Act
      entity.setCode(newCode);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(entity.code).toEqual(newCode);
    });
  });

  describe('setName', () => {
    it('sets the name and touches updatedAt', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const newName = ProductNameValueObject.create('New Name');
      const markAsUpdatedSpy = jest.spyOn(entity as any, 'markAsUpdated');

      // Act
      entity.setName(newName);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(entity.name).toEqual(newName);
    });
  });

  describe('setDescription', () => {
    it('sets the name and touches updatedAt', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const newDescription =
        ProductDescriptionValueObject.create('New Description');
      const markAsUpdatedSpy = jest.spyOn(entity as any, 'markAsUpdated');

      // Act
      entity.setDescription(newDescription);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(entity.description).toEqual(newDescription);
    });
  });

  describe('setCategory', () => {
    it('sets the category and touches updatedAt', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const newCategory = ProductCategoryEnum.SIDE;
      const markAsUpdatedSpy = jest.spyOn(entity as any, 'markAsUpdated');

      // Act
      entity.setCategory(newCategory);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(entity.category).toEqual(newCategory);
    });
  });

  describe('setPrice', () => {
    it('sets the price and touches updatedAt', async () => {
      // Arrange
      const entity = getDomainProductEntity();
      const newPrice = MoneyValueObject.create(1500);
      const markAsUpdatedSpy = jest.spyOn(entity as any, 'markAsUpdated');

      // Act
      entity.setPrice(newPrice);

      // Assert
      expect(markAsUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(entity.price).toEqual(newPrice);
    });
  });
});
