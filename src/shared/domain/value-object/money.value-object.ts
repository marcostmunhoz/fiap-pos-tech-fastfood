import { AbstractValueObject } from './abstract.value-object';

type MoneyValueObjectProps = {
  value: number;
};

export class MoneyValueObject extends AbstractValueObject<MoneyValueObjectProps> {
  get value(): number {
    return this.props.value;
  }

  get valueAsFloat(): number {
    return parseFloat((this.value / 100).toFixed(2));
  }

  sum(value: MoneyValueObject): MoneyValueObject {
    return MoneyValueObject.create(this.value + value.value);
  }

  multiply(value: number): MoneyValueObject {
    return MoneyValueObject.create(Math.round(this.valueAsFloat * value * 100));
  }

  /**
   * @param {number} value an integer representation (in cents) of the money value
   */
  public static create(value: number): MoneyValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid money value.');
    }

    return new MoneyValueObject({ value });
  }

  public static createFromFloat(value: number): MoneyValueObject {
    return this.create(Math.round(value * 100));
  }

  public static zero(): MoneyValueObject {
    return this.create(0);
  }

  private static isValid(value: number): boolean {
    if (value % 1 !== 0) {
      return false;
    }

    if (value === null || value === undefined || isNaN(value)) {
      return false;
    }

    if (value < 0) {
      return false;
    }

    return true;
  }
}
