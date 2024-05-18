import { AbstractValueObject } from './abstract.value-object';

type ProductNameValueObjectProps = {
  value: string;
};

export class ProductNameValueObject extends AbstractValueObject<ProductNameValueObjectProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(value: string): ProductNameValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid product name.');
    }

    return new ProductNameValueObject({ value });
  }

  private static isValid(value: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (value.length < 2 || value.length > 100) {
      return false;
    }

    return true;
  }
}
