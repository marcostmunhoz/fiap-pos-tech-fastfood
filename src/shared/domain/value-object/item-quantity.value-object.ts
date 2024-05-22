import { AbstractValueObject } from './abstract.value-object';

type ItemQuantityValueObjectProps = {
  value: number;
};

export class ItemQuantityValueObject extends AbstractValueObject<ItemQuantityValueObjectProps> {
  get value(): number {
    return this.props.value;
  }

  public sum(value: ItemQuantityValueObject): ItemQuantityValueObject {
    return ItemQuantityValueObject.create(this.value + value.value);
  }

  public static create(value: number): ItemQuantityValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid quantity value.');
    }

    return new ItemQuantityValueObject({ value });
  }

  private static isValid(value: number): boolean {
    if (value % 1 !== 0) {
      return false;
    }

    if (value === null || value === undefined || isNaN(value)) {
      return false;
    }

    if (value < 1) {
      return false;
    }

    return true;
  }
}
