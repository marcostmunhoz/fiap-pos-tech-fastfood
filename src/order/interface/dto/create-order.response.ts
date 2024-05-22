import { TransformValueObjectToPrimitive } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { UuidProperty } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { Expose } from 'class-transformer';

export class CreateOrderResponse {
  @Expose()
  @TransformValueObjectToPrimitive()
  @UuidProperty()
  id: string;
}
