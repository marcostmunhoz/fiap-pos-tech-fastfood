import { CustomerEntityPropsWithId } from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { UseCase } from '@/shared/application/use-case/use-case';
import { Inject } from '@nestjs/common';
import { CustomerRepositoryToken } from '../tokens';

export type Input = {
  cpf: CpfValueObject;
};

export type Output = CustomerEntityPropsWithId;

export class FindCustomerByCpfUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
  ) {}

  async execute({ cpf }: Input): Promise<Output | null> {
    return await this.repository.findByCpf(cpf);
  }
}
