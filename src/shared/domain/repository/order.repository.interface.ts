import { OrderEntity } from '../entity/order.entity';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';

export interface OrderRepository {
  findById(id: EntityIdValueObject): Promise<OrderEntity | null>;
  save(order: OrderEntity): Promise<OrderEntity>;
}
