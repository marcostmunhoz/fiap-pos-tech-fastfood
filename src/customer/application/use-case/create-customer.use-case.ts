import { EssentialCustomerEntityProps } from '@/customer/domain/entity/customer.entity';
import { UseCase } from '@/shared/application/use-case/use-case';
import { Inject } from '@nestjs/common';
import { CustomerRepositoryToken } from '../tokens';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';

export type Input = EssentialCustomerEntityProps;

export type Output = {
  id: EntityIdValueObject;
  name?: FullNameValueObject;
};

export class CreateCustomerUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
  ) {}

  async execute(props: Input): Promise<Output> {
    const entity = await this.repository.create(props);

    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
