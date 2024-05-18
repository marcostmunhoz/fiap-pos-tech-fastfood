import {
  ProductEntity as DomainProductEntity,
  ProductEntityProps,
  EssentialProductEntityProps as DomainEssentialProductEntityProps,
  ProductEntityPropsWithId,
  EssentialProductEntityProps,
} from '@/shared/domain/entity/product.entity';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';

export function getValidEntityId(): EntityIdValueObject {
  return EntityIdValueObject.create('customer-id');
}

export function getValidProductCode(): ProductCodeValueObject {
  return ProductCodeValueObject.create('CODE123');
}

export function getValidProductName(): ProductNameValueObject {
  return ProductNameValueObject.create('Some Product');
}

export function getValidMoney(): MoneyValueObject {
  return MoneyValueObject.create(12.34);
}

export function getValidProductCategory(): ProductCategoryEnum {
  return ProductCategoryEnum.FOOD;
}

export function getDomainEssentialProductEntityProps(): DomainEssentialProductEntityProps {
  return {
    code: getValidProductCode(),
    name: getValidProductName(),
    category: getValidProductCategory(),
    price: getValidMoney(),
  };
}

export function getDomainProductEntityProps(): ProductEntityProps {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainEssentialProductEntityProps(),
  };
}

export function getDomainProductEntityPropsWithId(): ProductEntityPropsWithId {
  return {
    id: getValidEntityId(),
    ...getDomainProductEntityProps(),
  };
}

export function getDomainProductEntity(
  props?: EssentialProductEntityProps,
): DomainProductEntity {
  return DomainProductEntity.create({
    id: getValidEntityId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getDomainEssentialProductEntityProps()),
  });
}
