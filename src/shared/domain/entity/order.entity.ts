import { OrderStatusEnum } from '../enum/order-status.enum';
import { ItemAlreadyAddedException } from '../exception/item-already-added.exception';
import { ItemNotFoundException } from '../exception/item-not-found.exception';
import { EntityIdValueObject } from '../value-object/entity-id.value-object';
import { ItemQuantityValueObject } from '../value-object/item-quantity.value-object';
import { MoneyValueObject } from '../value-object/money.value-object';
import { OrderItemValueObject } from '../value-object/order-item.value-object';
import { AbstractEntity } from './abstract.entity';

export type PartialOrderEntityProps = {
  customerId: string;
  customerName: string;
};

export type CompleteOrderEntityProps = PartialOrderEntityProps & {
  id: EntityIdValueObject;
  items: OrderItemValueObject[];
  total: MoneyValueObject;
  status: OrderStatusEnum;
  createdAt: Date;
  updatedAt: Date;
};

export class OrderEntity extends AbstractEntity<CompleteOrderEntityProps> {
  public get customerId(): string {
    return this.props.customerId;
  }

  public get customerName(): string {
    return this.props.customerName;
  }

  public get items(): OrderItemValueObject[] {
    return this.props.items;
  }

  public get total(): MoneyValueObject {
    return this.props.total;
  }

  public get status(): OrderStatusEnum {
    return this.props.status;
  }

  public canBeEdited(): boolean {
    return this.status === OrderStatusEnum.PENDING;
  }

  public addItem(item: OrderItemValueObject): OrderEntity {
    const exists = this.items.some(
      (existingItem) => existingItem.code === item.code,
    );

    if (exists) {
      throw new ItemAlreadyAddedException();
    }

    this.items.push(item);
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  public removeItem(code: string): OrderEntity {
    this.ensureItemExists(code);

    this.props.items = this.items.filter((item) => item.code !== code);
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  public changeItemQuantity(
    code: string,
    quantity: ItemQuantityValueObject,
  ): OrderEntity {
    this.ensureItemExists(code);

    this.props.items = this.items.map((item) => {
      if (item.code === code) {
        return OrderItemValueObject.create({
          code: item.code,
          name: item.name,
          price: item.price,
          quantity,
        });
      }

      return item;
    });
    this.updateTotal();
    this.markAsUpdated();

    return this;
  }

  private ensureItemExists(code: string): void {
    const exists = this.items.some((item) => item.code === code);

    if (!exists) {
      throw new ItemNotFoundException();
    }
  }

  private updateTotal(): void {
    const total = this.items.reduce(
      (carry: MoneyValueObject, item: OrderItemValueObject) =>
        carry.sum(item.total),
      MoneyValueObject.zero(),
    );

    this.props.total = total;
  }
}
