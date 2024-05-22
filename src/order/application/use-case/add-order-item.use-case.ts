import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { OrderRepositoryToken, ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import { OrderItemValueObject } from '@/shared/domain/value-object/order-item.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';

export type Input = {
  id: EntityIdValueObject;
  data: {
    productCode: string;
    quantity: ItemQuantityValueObject;
  };
};

export type Output = void;

export class AddOrderItemUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: OrderRepository,
    @Inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const order = await this.orderRepository.findById(input.id);

    if (!order) {
      throw new EntityNotFoundException('Order not found with given ID.');
    }

    const product = await this.productRepository.findByCode(
      ProductCodeValueObject.create(input.data.productCode),
    );

    if (!product) {
      throw new EntityNotFoundException('Product not found with given code.');
    }

    const item = OrderItemValueObject.create({
      code: product.code.value,
      name: product.name.value,
      price: product.price,
      quantity: input.data.quantity,
    });

    order.addItem(item);

    await this.orderRepository.save(order);
  }
}
