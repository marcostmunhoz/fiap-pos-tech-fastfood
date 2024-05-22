import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { TransformStringToEntityId } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderParam {
  @IsNotEmpty()
  @IsString()
  @TransformStringToEntityId()
  id: EntityIdValueObject;
}
