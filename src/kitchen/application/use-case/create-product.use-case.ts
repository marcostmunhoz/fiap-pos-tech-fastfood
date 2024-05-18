import { UseCase } from '@/shared/application/use-case/use-case.interface';
import {
  EssentialProductEntityProps,
  ProductEntityPropsWithId,
} from '@/shared/domain/entity/product.entity';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = EssentialProductEntityProps;

export type Output = ProductEntityPropsWithId;

export class CreateProductUseCase implements UseCase<Input, Output> {
  constructor(
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

    return await this.repository.create(input);
  }
}
