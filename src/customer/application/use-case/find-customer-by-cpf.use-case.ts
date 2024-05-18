import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { UseCase } from '@/shared/application/use-case/use-case';
import { Inject } from '@nestjs/common';
import { CustomerRepositoryToken } from '../../tokens';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';

export type Input = {
  cpf: CpfValueObject;
};

export type Output = {
  id: EntityIdValueObject;
  name?: FullNameValueObject;
};

export class FindCustomerByCpfUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
  ) {}

  async execute({ cpf }: Input): Promise<Output | null> {
    const entity = await this.repository.findByCpf(cpf);

    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
