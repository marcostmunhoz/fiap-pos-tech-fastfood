import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { SharedModule } from '@/shared/shared.module';
import { CreateProductController } from './interface/controller/create-product.controller';
import { ShowProductController } from './interface/controller/show-product.controller';
import { ShowProductUseCase } from './application/use-case/show-product.use-case';

const useCases = [CreateProductUseCase, ShowProductUseCase];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
  controllers: [CreateProductController, ShowProductController],
})
export class KitchenModule {}
