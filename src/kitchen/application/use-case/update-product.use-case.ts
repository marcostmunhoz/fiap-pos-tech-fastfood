import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EssentialProductEntityProps } from '@/shared/domain/entity/product.entity';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ProductRepositoryToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';

export type Input = {
  id: EntityIdValueObject;
  data: EssentialProductEntityProps;
};

export type Output = void;

export class UpdateProductUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly repository: ProductRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.repository.findById(input.id);

    if (!entity) {
      throw new EntityNotFoundException('Product not found with given ID.');
    }

    const exists = await this.repository.existsWithCode(input.data.code);

    if (exists) {
      throw new EntityAlreadyExistsException(
        'Another product already exists with given code.',
      );
    }

    const updatedEntity = entity
      .setCode(input.data.code)
      .setName(input.data.name)
      .setCategory(input.data.category)
      .setPrice(input.data.price);

    await this.repository.update(updatedEntity);
  }
}
