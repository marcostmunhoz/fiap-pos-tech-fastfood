import {
  OrderEntity as DomainOrderEntity,
  PartialOrderEntityProps,
  CompleteOrderEntityProps,
} from '@/shared/domain/entity/order.entity';
import {
  ProductEntity as DomainProductEntity,
  ProductEntityProps,
  EssentialProductEntityProps as DomainEssentialProductEntityProps,
  ProductEntityPropsWithId,
} from '@/shared/domain/entity/product.entity';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { OrderItemValueObject } from '@/shared/domain/value-object/order-item.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import { OrderEntity as InfrastructureOrderEntity } from '@/shared/infrastructure/entity/order.entity';
import {
  EssentialProductEntityProps as InfrastructureEssentialProductEntityProps,
  ProductEntity as InfrastructureProductEntity,
} from '@/shared/infrastructure/entity/product.entity';

export function getValidProductEntityId(): EntityIdValueObject {
  return EntityIdValueObject.create('product-id');
}

export function getValidOrderEntityId(): EntityIdValueObject {
  return EntityIdValueObject.create('order-id');
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

export function getValidOrderCustomerId(): string {
  return 'customer-id';
}

export function getValidOrderCustomerName(): string {
  return 'Customer Name';
}

export function getValidOrderItem(): OrderItemValueObject {
  return OrderItemValueObject.create({
    code: getValidProductCode().value,
    name: getValidProductName().value,
    price: MoneyValueObject.create(1000),
    quantity: ItemQuantityValueObject.create(1),
  });
}

export function getValidOrderTotal(): MoneyValueObject {
  return MoneyValueObject.create(1000);
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
    id: getValidProductEntityId(),
    ...getDomainProductEntityProps(),
  };
}

export function getDomainProductEntity(
  props?: DomainEssentialProductEntityProps,
): DomainProductEntity {
  return DomainProductEntity.create({
    id: getValidProductEntityId(),
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

export function getDomainPartialOrderEntityProps(): PartialOrderEntityProps {
  return {
    customerId: getValidOrderCustomerId(),
    customerName: getValidOrderCustomerName(),
  };
}

export function getDomainCompletedOrderEntityProps(): CompleteOrderEntityProps {
  return {
    id: getValidOrderEntityId(),
    items: [getValidOrderItem()],
    total: getValidOrderTotal(),
    status: OrderStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainPartialOrderEntityProps(),
  };
}

export function getDomainOrderEntity(
  props?: CompleteOrderEntityProps,
): DomainOrderEntity {
  return new DomainOrderEntity(props || getDomainCompletedOrderEntityProps());
}

export function getInfrastructureOrderEntity(): InfrastructureOrderEntity {
  const item = getValidOrderItem();

  return {
    id: 'order-id',
    customerId: getValidOrderCustomerId(),
    customerName: getValidOrderCustomerName(),
    items: [
      {
        code: item.code,
        name: item.name,
        price: item.price.value,
        quantity: item.quantity.value,
      },
    ],
    total: item.price.value,
    status: OrderStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
