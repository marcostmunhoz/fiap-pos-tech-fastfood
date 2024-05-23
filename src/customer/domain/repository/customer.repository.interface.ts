import { CustomerEntity } from '../entity/customer.entity';
import { CpfValueObject } from '../value-object/cpf.value-object';

export interface CustomerRepository {
  findByCpf(cpf: CpfValueObject): Promise<CustomerEntity | null>;
  save(entity: CustomerEntity): Promise<CustomerEntity>;
  existsWithCpf(cpf: CpfValueObject): Promise<boolean>;
}
