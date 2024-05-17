import { EntityIdValueObject } from '../value-object/entity-id.value-object';

export interface EntityIdGeneratorHelper {
  generate(): EntityIdValueObject;
}
