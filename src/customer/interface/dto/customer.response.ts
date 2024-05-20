import { TransformValueObjectToPrimitive } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { UuidProperty } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CustomerResponse {
  @Expose()
  @TransformValueObjectToPrimitive()
  @UuidProperty()
  id: string;

  @Expose()
  @TransformValueObjectToPrimitive()
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  name?: string;
}
