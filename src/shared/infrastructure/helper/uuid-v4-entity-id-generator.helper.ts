import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { v4 } from 'uuid';

export class UuidV4EntityIdGeneratorHelper implements EntityIdGeneratorHelper {
  generate(): EntityIdValueObject {
    return EntityIdValueObject.create(v4());
  }
}
