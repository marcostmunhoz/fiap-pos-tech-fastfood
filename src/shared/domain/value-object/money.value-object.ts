import { AbstractValueObject } from './abstract.value-object';

type MoneyValueObjectProps = {
  value: number;
};

export class MoneyValueObject extends AbstractValueObject<MoneyValueObjectProps> {
  get value(): number {
    return this.props.value;
  }

  public static create(value: number): MoneyValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid money value.');
    }

    return new MoneyValueObject({ value });
  }

  private static isValid(value: number): boolean {
    if (value === null || value === undefined || isNaN(value)) {
      return false;
    }

    if (value < 0.01) {
      return false;
    }

    return true;
  }
}
