import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { Transform } from 'class-transformer';
import { Allow } from 'class-validator';

export class FindCustomerByCpfPathParam {
  @Allow()
  @Transform(({ value }) => CpfValueObject.create(value))
  cpf: CpfValueObject;
}
