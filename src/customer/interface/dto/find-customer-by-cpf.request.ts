import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { TransformPrimitiveToValueObject } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { Allow } from 'class-validator';

export class FindCustomerByCpfPathParam {
  @Allow()
  @TransformPrimitiveToValueObject(CpfValueObject)
  cpf: CpfValueObject;
}
