import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CustomerResponse {
  @Expose()
  @Transform(({ obj }) => (obj.id as EntityIdValueObject).value)
  @ApiProperty({
    example: '053b636d-aaa3-4700-9ead-fe9cfd20507f',
  })
  id: string;

  @Expose()
  @Transform(({ obj }) => (obj.name as FullNameValueObject)?.value || null)
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  name?: string;
}
