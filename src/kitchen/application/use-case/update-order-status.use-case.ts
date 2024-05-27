import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  data: {
    status:
      | OrderStatusEnum.PREPARING
      | OrderStatusEnum.READY
      | OrderStatusEnum.DELIVERED;
  };
};

export type Output = void;

export class UpdateOrderStatusUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    const { status } = input.data;

    if (OrderStatusEnum.PREPARING === status) {
      order.markAsPreparing();
    } else if (OrderStatusEnum.READY === status) {
      order.markAsReady();
    } else {
      order.markAsDelivered();
    }

    await this.orderRepository.save(order);
  }
}
