import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { SharedModule } from '@/shared/shared.module';
import { CreateProductController } from './interface/controller/create-product.controller';
import { ShowProductController } from './interface/controller/show-product.controller';
import { ShowProductUseCase } from './application/use-case/show-product.use-case';
import { UpdateProductController } from './interface/controller/update-product.controller';
import { UpdateProductUseCase } from './application/use-case/update-product.use-case';

const useCases = [
  CreateProductUseCase,
  ShowProductUseCase,
  UpdateProductUseCase,
];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
  controllers: [
    CreateProductController,
    ShowProductController,
    UpdateProductController,
  ],
})
export class KitchenModule {}
