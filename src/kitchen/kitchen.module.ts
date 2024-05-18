import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-case/create-product.use-case';
import { SharedModule } from '@/shared/shared.module';

const useCases = [CreateProductUseCase];

@Module({
  imports: [SharedModule],
  providers: [...useCases],
})
export class KitchenModule {}
