import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Expose, Transform } from 'class-transformer';

export class CustomerResponse {
  @Expose()
  @Transform(({ obj }) => (obj.id as EntityIdValueObject).value)
  id: string;

  @Expose()
  @Transform(({ obj }) => (obj.name as FullNameValueObject).value)
  name: string;
}
