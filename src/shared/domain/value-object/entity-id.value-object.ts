import { AbstractValueObject } from './abstract.value-object';

type EntityIdValueObjectProps = {
  value: string;
};

export class EntityIdValueObject extends AbstractValueObject<EntityIdValueObjectProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(id: string): EntityIdValueObject {
    if (!id) {
      this.throwInvalidValue('Invalid ID.');
    }

    const cleanId = String(id).trim();

    if (cleanId.length === 0) {
      this.throwInvalidValue('Invalid ID.');
    }

    return new EntityIdValueObject({ value: cleanId });
  }
}
