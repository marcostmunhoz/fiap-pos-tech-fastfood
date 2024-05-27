import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { DeleteProductUseCase } from './application/use-case/delete-product.use-case';
import { ListOrdersUseCase } from './application/use-case/list-orders.use-case';
import { SearchProductsUseCase } from './application/use-case/search-products.use-case';
import { ShowProductUseCase } from './application/use-case/show-product.use-case';
import { UpdateProductUseCase } from './application/use-case/update-product.use-case';
import { CreateProductController } from './interface/controller/create-product.controller';
import { DeleteProductController } from './interface/controller/delete-product.controller';
import { ListOrdersController } from './interface/controller/list-orders.controller';
import { SearchProductsController } from './interface/controller/search-products.controller';
import { ShowProductController } from './interface/controller/show-product.controller';
import { UpdateProductController } from './interface/controller/update-product.controller';

const useCases = [
  CreateProductUseCase,
  ShowProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  SearchProductsUseCase,
  ListOrdersUseCase,
];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
  controllers: [
    CreateProductController,
    ShowProductController,
    UpdateProductController,
    DeleteProductController,
    SearchProductsController,
    ListOrdersController,
  ],
})
export class KitchenModule {}
