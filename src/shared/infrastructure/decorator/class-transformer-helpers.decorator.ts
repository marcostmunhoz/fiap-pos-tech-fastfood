import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Transform } from 'class-transformer';

export const TransformPrimitiveToValueObject = <T>(cls: Function) =>
  Transform(({ value }): T => (cls as any).create(value));

export const TransformValueObjectToPrimitive = () =>
  Transform(({ key, obj }): any => obj[key].value);

export const TransformEntityIdToString = () =>
  Transform(({ obj }): string => (obj.id as EntityIdValueObject).value);

export const TransformStringToEntityId = () =>
  Transform(
    ({ value }): EntityIdValueObject => EntityIdValueObject.create(value),
  );
