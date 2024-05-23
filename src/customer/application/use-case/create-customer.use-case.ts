import { PartialCustomerEntityProps } from '@/customer/domain/entity/customer.entity';
import { CustomerFactory } from '@/customer/domain/factory/customer.factory';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { UseCase } from '@/shared/application/use-case/use-case.interface';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Inject } from '@nestjs/common';
import { CustomerRepositoryToken } from '../../tokens';

export type Input = PartialCustomerEntityProps;

export type Output = {
  id: EntityIdValueObject;
  name?: FullNameValueObject;
};

export class CreateCustomerUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly factory: CustomerFactory,
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
  ) {}

  async execute(props: Input): Promise<Output> {
    const exists = props.cpf
      ? await this.repository.existsWithCpf(props.cpf)
      : false;

    if (exists) {
      throw new EntityAlreadyExistsException(
        'Customer already exists with given CPF.',
      );
    }

    const entity = this.factory.createCustomer(props);
    const { id, name } = await this.repository.save(entity);

    return { id, name };
  }
}
