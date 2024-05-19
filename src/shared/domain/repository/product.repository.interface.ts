import {
  EssentialProductEntityProps,
  ProductEntity,
} from '../entity/product.entity';
import { ProductCategoryEnum } from '../enum/product-category.enum';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';
import { ProductCodeValueObject } from '../value-object/product-code.value-object';

export type SearchProductQuery = {
  query?: string;
  category?: ProductCategoryEnum;
};

export interface ProductRepository {
  list(): Promise<ProductEntity[]>;
  search(filter: SearchProductQuery): Promise<ProductEntity[]>;
  findById(id: EntityIdValueObject): Promise<ProductEntity | null>;
  create(product: EssentialProductEntityProps): Promise<ProductEntity>;
  update(product: ProductEntity): Promise<ProductEntity>;
  delete(id: EntityIdValueObject): Promise<void>;
  existsWithCode(
    code: ProductCodeValueObject,
    except?: EntityIdValueObject,
  ): Promise<boolean>;
  existsWithId(id: EntityIdValueObject): Promise<boolean>;
}
