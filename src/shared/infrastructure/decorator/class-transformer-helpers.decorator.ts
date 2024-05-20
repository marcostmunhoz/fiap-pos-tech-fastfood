import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { Transform } from 'class-transformer';

type TransformOptionalCallback = (value: any) => any | null;

export const TransformOptional = (callback: TransformOptionalCallback) =>
  Transform(({ value, key }) => {
    console.log(value, key);
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return callback(value);
  });

export const TransformObjectKeyOptional = (
  callback: TransformOptionalCallback,
) =>
  Transform(({ obj, key }) => {
    const value = obj[key];

    if (value === null || value === undefined || value === '') {
      return null;
    }

    return callback(value);
  });

export const TransformPrimitiveToValueObject = <T>(cls: Function) =>
  TransformOptional((value): T => (cls as any).create(value));

export const TransformValueObjectToPrimitive = () =>
  TransformObjectKeyOptional((obj): any => obj.value);

export const TransformStringToEntityId = () =>
  TransformPrimitiveToValueObject(EntityIdValueObject);
