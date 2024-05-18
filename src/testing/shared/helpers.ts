import {
  ProductEntity as DomainProductEntity,
  ProductEntityProps,
  EssentialProductEntityProps as DomainEssentialProductEntityProps,
  ProductEntityPropsWithId,
} from '@/shared/domain/entity/product.entity';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import {
  EssentialProductEntityProps as InfrastructureEssentialProductEntityProps,
  ProductEntity as InfrastructureProductEntity,
} from '@/shared/infrastructure/entity/product.entity';

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
  return MoneyValueObject.create(1234);
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
  props?: DomainEssentialProductEntityProps,
): DomainProductEntity {
  return DomainProductEntity.create({
    id: getValidEntityId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getDomainEssentialProductEntityProps()),
  });
}

export function getInfrastructureEssentialProductEntityProps(): InfrastructureEssentialProductEntityProps {
  return {
    id: 'product-id',
    code: getValidProductCode().value,
    name: getValidProductName().value,
    category: getValidProductCategory(),
    price: getValidMoney().value,
  };
}

export function getInfrastructureProductEntity(
  props?: InfrastructureEssentialProductEntityProps,
): InfrastructureProductEntity {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getInfrastructureEssentialProductEntityProps()),
  };
}
