import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { ProductEntityPropsWithId } from '@/shared/domain/entity/product.entity';
import {
  ProductRepository,
  SearchProductQuery,
} from '@/shared/domain/repository/product.repository.interface';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = SearchProductQuery;

export type Output = ProductEntityPropsWithId[];

export class SearchProductsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: ProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    return await this.repository.search(input);
  }
}
