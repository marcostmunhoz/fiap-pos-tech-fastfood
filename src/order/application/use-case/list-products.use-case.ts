import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = void;

export type Output = Array<{
  category: string;
  products: Array<{
    code: string;
    name: string;
    description: string;
    price: number;
  }>;
}>;

export class ListProductsUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: ProductRepository,
  ) {}

  async execute(): Promise<Output> {
    const products = await this.repository.list();
    const groupedProducts = products.reduce((carry, product) => {
      if (!carry[product.category]) {
        carry[product.category] = [];
      }

      carry[product.category].push({
        code: product.code.value,
        name: product.name.value,
        description: product.description.value,
        price: product.price.valueAsFloat,
      });

      return carry;
    }, {});

    return Object.entries(groupedProducts)
      .map(([category, products]) => ({
        category,
        products,
      }))
      .sort((a, b) => a.category.localeCompare(b.category)) as Output;
  }
}
