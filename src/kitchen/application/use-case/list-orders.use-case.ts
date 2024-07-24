import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { OrderEntity } from '@/shared/domain/entity/order.entity';
import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { OrderRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = void;

export type Output = Array<{
  status: OrderStatusEnum;
  orders: Array<{
    id: string;
    customerName?: string;
    items: Array<{
      code: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    updatedAt: Date;
  }>;
}>;

export class ListOrdersUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<Output> {
    const readyOrders = await this.orderRepository.listAscendingByCreatedAt(
      OrderStatusEnum.READY,
    );
    const preparingOrders = await this.orderRepository.listAscendingByCreatedAt(
      OrderStatusEnum.PREPARING,
    );
    const paidOrders = await this.orderRepository.listAscendingByCreatedAt(
      OrderStatusEnum.PAID,
    );
    return [
      {
        status: OrderStatusEnum.READY,
        orders: readyOrders.map(this.mapOrderToOutput),
      },
      {
        status: OrderStatusEnum.PREPARING,
        orders: preparingOrders.map(this.mapOrderToOutput),
      },
      {
        status: OrderStatusEnum.PAID,
        orders: paidOrders.map(this.mapOrderToOutput),
      },
    ];
  }

  private mapOrderToOutput(order: OrderEntity) {
    return {
      id: order.id.value,
      customerName: order.customerName,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        code: item.code,
        name: item.name,
        price: item.price.valueAsFloat,
        quantity: item.quantity.value,
      })),
    };
  }
}
