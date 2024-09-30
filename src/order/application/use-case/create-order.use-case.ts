import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { OrderFactory } from '@/shared/domain/factory/order.factory';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = UserEntity;

export type Output = {
  id: EntityIdValueObject;
};

export class CreateOrderUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    private readonly orderFactory: OrderFactory,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = this.orderFactory.createOrder({
      customerId: input.id,
      customerName: input.name,
    });

    const { id } = await this.orderRepository.save(order);

    return { id };
  }
}
