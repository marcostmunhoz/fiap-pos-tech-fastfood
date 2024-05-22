import { AbstractValueObject } from './abstract.value-object';
import { ItemQuantityValueObject } from './item-quantity.value-object';
import { MoneyValueObject } from './money.value-object';

type OrderItemValueObjectProps = {
  code: string;
  name: string;
  quantity: ItemQuantityValueObject;
  price: MoneyValueObject;
};

export class OrderItemValueObject extends AbstractValueObject<OrderItemValueObjectProps> {
  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get quantity(): ItemQuantityValueObject {
    return this.props.quantity;
  }

  get price(): MoneyValueObject {
    return this.props.price;
  }

  get total(): MoneyValueObject {
    return this.price.multiply(this.quantity.value);
  }

  public static create(props: OrderItemValueObjectProps): OrderItemValueObject {
    if (!this.isValid(props)) {
      this.throwInvalidValue('Invalid order item.');
    }

    return new OrderItemValueObject(props);
  }

  private static isValid(props: OrderItemValueObjectProps): boolean {
    if (props.code === null || props.code === undefined || props.code === '') {
      return false;
    }

    if (props.name === null || props.name === undefined || props.name === '') {
      return false;
    }

    return true;
  }
}
