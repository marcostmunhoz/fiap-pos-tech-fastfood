import { CustomerEntity } from '@/customer/domain/entity/customer.entity';
import {
  EssentialProductEntityProps,
  ProductEntity,
} from '../entity/product.entity';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';

export interface ProductRepository {
  list(): Promise<ProductEntity[]>;
  search(query: string): Promise<ProductEntity[]>;
  findById(id: EntityIdValueObject): Promise<ProductEntity | null>;
  create(product: EssentialProductEntityProps): Promise<CustomerEntity>;
  update(product: ProductEntity): Promise<CustomerEntity>;
  delete(id: EntityIdValueObject): Promise<void>;
}
