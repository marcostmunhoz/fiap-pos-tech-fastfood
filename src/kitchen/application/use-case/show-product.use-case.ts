import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { ProductEntityPropsWithId } from '@/shared/domain/entity/product.entity';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
};

export type Output = ProductEntityPropsWithId;

export class ShowProductUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: ProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.repository.findById(input.id);

    if (!entity) {
      throw new EntityNotFoundException('Product not found with given ID.');
    }

    return entity;
  }
}
