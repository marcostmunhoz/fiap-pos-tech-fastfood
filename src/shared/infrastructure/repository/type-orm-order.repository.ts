import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OrderEntity as InfrastructureOrderEntity,
  OrderItemProps,
} from '../entity/order.entity';
import { OrderEntity as DomainOrderEntity } from '@/shared/domain/entity/order.entity';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Repository } from 'typeorm';
import { OrderItemValueObject } from '@/shared/domain/value-object/order-item.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';

export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(InfrastructureOrderEntity)
    private readonly typeOrmRepository: Repository<InfrastructureOrderEntity>,
  ) {}

  async findById(id: EntityIdValueObject): Promise<DomainOrderEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({ id: id.value });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async save(order: DomainOrderEntity): Promise<DomainOrderEntity> {
    const dbEntity = await this.typeOrmRepository.save(
      this.mapToDbEntity(order),
    );

    return this.mapToDomainEntity(dbEntity);
  }

  private mapToDomainEntity(
    entity: InfrastructureOrderEntity,
  ): DomainOrderEntity {
    const items = entity.items.map((item: OrderItemProps) =>
      OrderItemValueObject.create({
        code: item.code,
        name: item.name,
        price: MoneyValueObject.create(item.price),
        quantity: ItemQuantityValueObject.create(item.quantity),
      }),
    );

    return new DomainOrderEntity({
      id: EntityIdValueObject.create(entity.id),
      customerId: entity.customerId,
      customerName: entity.customerName,
      total: MoneyValueObject.create(entity.total),
      items,
      status: entity.status as OrderStatusEnum,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToDbEntity(entity: DomainOrderEntity): InfrastructureOrderEntity {
    return {
      id: entity.id.value,
      customerId: entity.customerId,
      customerName: entity.customerName,
      total: entity.total.value,
      items: entity.items.map((item) => ({
        code: item.code,
        name: item.name,
        price: item.price.value,
        quantity: item.quantity.value,
      })),
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
