import {
  CustomerEntityPropsWithId,
  EssentialCustomerEntityProps,
} from '@/customer/domain/entity/customer.entity';
import { UseCase } from '@/shared/application/use-case/use-case';
import { Inject } from '@nestjs/common';
import { CustomerRepositoryToken } from '../tokens';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';

export type Input = EssentialCustomerEntityProps;

export type Output = CustomerEntityPropsWithId;

export class CreateCustomerUseCase implements UseCase<Input, Output> {
  constructor(
    @Inject(CustomerRepositoryToken)
    private readonly repository: CustomerRepository,
  ) {}

  async execute(props: Input): Promise<Output> {
    return await this.repository.create(props);
  }
}
