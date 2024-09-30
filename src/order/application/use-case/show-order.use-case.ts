import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { UnauthorizedResourceException } from '@/shared/domain/exception/unauthorized-resource.exception';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  user: UserEntity;
};

export type Output = {
  items: Array<{
    code: string;
    name: string;
    price: MoneyValueObject;
    quantity: ItemQuantityValueObject;
  }>;
  total: MoneyValueObject;
  status: OrderStatusEnum;
};

export class ShowOrderUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    if (order.customerId !== input.user.id) {
      throw new UnauthorizedResourceException();
    }

    return {
      items: order.items,
      total: order.total,
      status: order.status,
    };
  }
}
