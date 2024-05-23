import { ProductCategoryEnum } from '../enum/product-category.enum';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';
import { MoneyValueObject } from '../value-object/money.value-object';
import { ProductCodeValueObject } from '../value-object/product-code.value-object';
import { ProductNameValueObject } from '../value-object/product-name.value-object';
import { AbstractEntity } from './abstract.entity';

export type PartialProductEntityProps = {
  code: ProductCodeValueObject;
  name: ProductNameValueObject;
  category: ProductCategoryEnum;
  price: MoneyValueObject;
};

export type CompleteProductEntityProps = PartialProductEntityProps & {
  id: EntityIdValueObject;
  createdAt: Date;
  updatedAt: Date;
};

export class ProductEntity extends AbstractEntity<CompleteProductEntityProps> {
  public get code(): ProductCodeValueObject {
    return this.props.code;
  }

  public get name(): ProductNameValueObject {
    return this.props.name;
  }

  public get category(): ProductCategoryEnum {
    return this.props.category;
  }

  public get price(): MoneyValueObject {
    return this.props.price;
  }

  public setCode(code: ProductCodeValueObject): ProductEntity {
    this.props.code = code;
    this.markAsUpdated();

    return this;
  }

  public setName(name: ProductNameValueObject): ProductEntity {
    this.props.name = name;
    this.markAsUpdated();

    return this;
  }

  public setCategory(category: ProductCategoryEnum): ProductEntity {
    this.props.category = category;
    this.markAsUpdated();

    return this;
  }

  public setPrice(price: MoneyValueObject): ProductEntity {
    this.props.price = price;
    this.markAsUpdated();

    return this;
  }
}
