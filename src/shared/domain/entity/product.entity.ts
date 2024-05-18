import { ProductCategoryEnum } from '../enum/product-category.enum';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';
import { MoneyValueObject } from '../value-object/money.value-object';
import { ProductCodeValueObject } from '../value-object/product-code.value-object';
import { ProductNameValueObject } from '../value-object/product-name.value-object';

export type EssentialProductEntityProps = {
  code: ProductCodeValueObject;
  name: ProductNameValueObject;
  category: ProductCategoryEnum;
  price: MoneyValueObject;
};

export type ProductEntityProps = EssentialProductEntityProps & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProductEntityPropsWithId = ProductEntityProps & {
  id: EntityIdValueObject;
};

export class ProductEntity {
  public readonly id: EntityIdValueObject;
  public readonly code: ProductCodeValueObject;
  public readonly name: ProductNameValueObject;
  public readonly category: ProductCategoryEnum;
  public readonly price: MoneyValueObject;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: ProductEntityPropsWithId) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.category = props.category;
    this.price = props.price;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: ProductEntityPropsWithId): ProductEntity {
    const entity = new ProductEntity(props);

    return entity;
  }
}
