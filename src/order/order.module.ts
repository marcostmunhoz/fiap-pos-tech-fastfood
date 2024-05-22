import { Module } from '@nestjs/common';
import { CreateOrderController } from './interface/controller/create-order.controller';
import { CreateOrderUseCase } from './application/use-case/create-order.use-case';
import { SharedModule } from '@/shared/shared.module';
import { AddOrderItemController } from './interface/controller/add-order-item.controller';
import { RemoveOrderItemController } from './interface/controller/remove-order-item.controller';
import { ChangeOrderItemQuantityController } from './interface/controller/change-order-item-quantity.controller';
import { AddOrderItemUseCase } from './application/use-case/add-order-item.use-case';
import { RemoveOrderItemUseCase } from './application/use-case/remove-order-item.use-case';
import { ChangeOrderItemQuantityUseCase } from './application/use-case/change-order-item-quantity.use-case';
import { ListProductsController } from './interface/controller/list-products.controller';
import { ListProductsUseCase } from './application/use-case/list-products.use-case';
import { ShowOrderController } from './interface/controller/show-order.controller';
import { ShowOrderUseCase } from './application/use-case/show-order.use-case';

const useCases = [
  CreateOrderUseCase,
  AddOrderItemUseCase,
  RemoveOrderItemUseCase,
  ChangeOrderItemQuantityUseCase,
  ListProductsUseCase,
  ShowOrderUseCase,
];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
  controllers: [
    CreateOrderController,
    AddOrderItemController,
    RemoveOrderItemController,
    ChangeOrderItemQuantityController,
    ListProductsController,
    ShowOrderController,
  ],
})
export class OrderModule {}
