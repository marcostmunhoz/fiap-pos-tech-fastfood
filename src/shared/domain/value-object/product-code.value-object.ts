import { AbstractValueObject } from './abstract.value-object';

type ProductCodeValueObjectProps = {
  value: string;
};

export class ProductCodeValueObject extends AbstractValueObject<ProductCodeValueObjectProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(value: string): ProductCodeValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid product code.');
    }

    const upperCasedValue = value.toUpperCase();

    return new ProductCodeValueObject({ value: upperCasedValue });
  }

  private static isValid(value: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (value.length < 2 || value.length > 20) {
      return false;
    }

    if (value.includes(' ')) {
      return false;
    }

    return true;
  }
}
