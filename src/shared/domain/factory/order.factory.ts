import { EntityIdGeneratorHelperToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import { OrderEntity, PartialOrderEntityProps } from '../entity/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { EntityIdGeneratorHelper } from '../helper/entity-id-generator.helper.interface';
import { MoneyValueObject } from '../value-object/money.value-object';

export class OrderFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createOrder(props: PartialOrderEntityProps): OrderEntity {
    return new OrderEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      items: [],
      total: MoneyValueObject.zero(),
      status: OrderStatusEnum.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
