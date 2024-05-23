import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdGeneratorHelperToken } from '@/shared/tokens';
import { Inject } from '@nestjs/common';
import {
  CustomerEntity,
  PartialCustomerEntityProps,
} from '../entity/customer.entity';

export class CustomerFactory {
  constructor(
    @Inject(EntityIdGeneratorHelperToken)
    private readonly entityIdGenerator: EntityIdGeneratorHelper,
  ) {}

  public createCustomer(props: PartialCustomerEntityProps): CustomerEntity {
    return new CustomerEntity({
      ...props,
      id: this.entityIdGenerator.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
