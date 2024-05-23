import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { TransformPrimitiveToValueObject } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentParam {
  @IsNotEmpty()
  @IsString()
  @TransformPrimitiveToValueObject(EntityIdValueObject)
  id: EntityIdValueObject;
}
