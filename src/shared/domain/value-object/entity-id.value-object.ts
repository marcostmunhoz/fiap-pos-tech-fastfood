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
      throw new Error('Invalid ID.');
    }

    const cleanId = String(id).trim();

    if (cleanId.length === 0) {
      throw new Error('Invalid ID.');
    }

    return new EntityIdValueObject({ value: cleanId });
  }
}
