import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { SharedModule } from '@/shared/shared.module';
import { CreateProductController } from './interface/controller/create-product.controller';

const useCases = [CreateProductUseCase];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
  controllers: [CreateProductController],
})
export class KitchenModule {}
