import { UseCase } from '@/shared/application/use-case/use-case.interface';
import {
  CompleteProductEntityProps,
  PartialProductEntityProps,
} from '@/shared/domain/entity/product.entity';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { ProductFactory } from '@/shared/domain/factory/product.factory';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = PartialProductEntityProps;

export type Output = CompleteProductEntityProps;

export class CreateProductUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly factory: ProductFactory,
    @Inject(ProductRepositoryToken)
    private readonly repository: ProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const exists = await this.repository.existsWithCode(input.code);

    if (exists) {
      throw new EntityAlreadyExistsException(
        'Product already exists with given code.',
      );
    }

    const entity = this.factory.createProduct(input);

    return await this.repository.save(entity);
  }
}
