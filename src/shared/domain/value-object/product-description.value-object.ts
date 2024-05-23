import { AbstractValueObject } from './abstract.value-object';

type ProductDescriptionValueObjectProps = {
  value: string;
};

export class ProductDescriptionValueObject extends AbstractValueObject<ProductDescriptionValueObjectProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(value: string): ProductDescriptionValueObject {
    if (!this.isValid(value)) {
      this.throwInvalidValue('Invalid product description.');
    }

    return new ProductDescriptionValueObject({ value });
  }

  private static isValid(value: string): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (value.length < 2 || value.length > 255) {
      return false;
    }

    return true;
  }
}
