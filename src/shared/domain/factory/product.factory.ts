import { EntityIdGeneratorHelperToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import {
  PartialProductEntityProps,
  ProductEntity,
} from '../entity/product.entity';
import { EntityIdGeneratorHelper } from '../helper/entity-id-generator.helper.interface';

export class ProductFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createProduct(props: PartialProductEntityProps): ProductEntity {
    return new ProductEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
