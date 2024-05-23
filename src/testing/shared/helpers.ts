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
import { ProductDescriptionValueObject } from '@/shared/domain/value-object/product-description.value-object';
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

export const getValidProductDescription = (): ProductDescriptionValueObject =>
  ProductDescriptionValueObject.create('Some Product Description');

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
    description: getValidProductDescription(),
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
    description: props.description || defaultProps.description,
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
    description: props.description?.value || defaultProps.description.value,
    category: props.category || defaultProps.category,
    price: props.price?.value || defaultProps.price.value,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};

export const getDomainPartialOrderEntityProps =
  (): PartialOrderEntityProps => ({
    customerId: getValidOrderCustomerId(),
    customerName: getValidOrderCustomerName(),
  });

export const getDomainCompleteOrderEntityProps =
  (): CompleteOrderEntityProps => ({
    id: getValidOrderEntityId(),
    items: [getValidOrderItem()],
    total: getValidOrderTotal(),
    status: OrderStatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainPartialOrderEntityProps(),
  });

export const getDomainOrderEntity = (
  props: Partial<CompleteOrderEntityProps> = {},
): DomainOrderEntity => {
  const defaultProps = getDomainCompleteOrderEntityProps();

  return new DomainOrderEntity({
    id: props.id || defaultProps.id,
    customerId: props.customerId || defaultProps.customerId,
    customerName: props.customerName || defaultProps.customerName,
    items: props.items || defaultProps.items,
    total: props.total || defaultProps.total,
    status: props.status || defaultProps.status,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  });
};

export const getInfrastructureOrderEntity = (
  props: Partial<CompleteOrderEntityProps> = {},
): InfrastructureOrderEntity => {
  const defaultProps = getDomainCompleteOrderEntityProps();
  const items = (props.items || defaultProps.items).map((item) => ({
    code: item.code,
    name: item.name,
    price: item.price.value,
    quantity: item.quantity.value,
  }));

  return {
    id: props.id?.value || defaultProps.id.value,
    customerId: props.customerId || defaultProps.customerId,
    customerName: props.customerName || defaultProps.customerName,
    items,
    total: props.total?.value || defaultProps.total.value,
    status: props.status || defaultProps.status,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};
