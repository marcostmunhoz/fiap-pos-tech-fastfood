import {
  CompleteOrderEntityProps,
  OrderEntity as DomainOrderEntity,
  PartialOrderEntityProps,
} from '@/shared/domain/entity/order.entity';
import {
  CompleteProductEntityProps,
  ProductEntity as DomainProductEntity,
  PartialProductEntityProps,
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
import { ProductEntity as InfrastructureProductEntity } from '@/shared/infrastructure/entity/product.entity';

export const getValidProductEntityId = (): EntityIdValueObject =>
  EntityIdValueObject.create('product-id');

export const getValidOrderEntityId = (): EntityIdValueObject =>
  EntityIdValueObject.create('order-id');

export const getValidProductCode = (): ProductCodeValueObject =>
  ProductCodeValueObject.create('CODE123');

export const getValidProductName = (): ProductNameValueObject =>
  ProductNameValueObject.create('Some Product');

export const getValidMoney = (): MoneyValueObject =>
  MoneyValueObject.create(1234);

export const getValidProductCategory = (): ProductCategoryEnum =>
  ProductCategoryEnum.FOOD;

export const getValidOrderCustomerId = (): string => 'customer-id';

export const getValidOrderCustomerName = (): string => 'Customer Name';

export const getValidOrderItem = (): OrderItemValueObject =>
  OrderItemValueObject.create({
    code: getValidProductCode().value,
    name: getValidProductName().value,
    price: MoneyValueObject.create(1000),
    quantity: ItemQuantityValueObject.create(1),
  });

export const getValidOrderTotal = (): MoneyValueObject =>
  MoneyValueObject.create(1000);

export const getDomainPartialProductEntityProps =
  (): PartialProductEntityProps => ({
    code: getValidProductCode(),
    name: getValidProductName(),
    category: getValidProductCategory(),
    price: getValidMoney(),
  });

export const getDomainCompleteProductEntityProps =
  (): CompleteProductEntityProps => ({
    id: getValidProductEntityId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainPartialProductEntityProps(),
  });

export const getDomainProductEntity = (
  props: Partial<CompleteProductEntityProps> = {},
): DomainProductEntity => {
  const defaultProps = getDomainCompleteProductEntityProps();

  return new DomainProductEntity({
    id: props.id || defaultProps.id,
    code: props.code || defaultProps.code,
    name: props.name || defaultProps.name,
    category: props.category || defaultProps.category,
    price: props.price || defaultProps.price,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  });
};

export const getInfrastructureProductEntity = (
  props: Partial<CompleteProductEntityProps> = {},
): InfrastructureProductEntity => {
  const defaultProps = getDomainCompleteProductEntityProps();

  return {
    id: props.id?.value || defaultProps.id.value,
    code: props.code?.value || defaultProps.code.value,
    name: props.name?.value || defaultProps.name.value,
    category: props.category || defaultProps.category,
    price: props.price?.value || defaultProps.price.value,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};

export function getDomainPartialOrderEntityProps(): PartialOrderEntityProps {
  return {
    customerId: getValidOrderCustomerId(),
    customerName: getValidOrderCustomerName(),
  };
}

export function getDomainCompleteOrderEntityProps(): CompleteOrderEntityProps {
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
  return new DomainOrderEntity(props || getDomainCompleteOrderEntityProps());
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
