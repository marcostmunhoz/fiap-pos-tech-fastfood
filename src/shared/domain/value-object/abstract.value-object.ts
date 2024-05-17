import { shallowEqual } from 'shallow-equal-object';
import { InvalidValueException } from '../exception/invalid-value.exception';

interface ValueObjectProps {
  [index: string]: any;
}

export abstract class AbstractValueObject<T extends ValueObjectProps> {
  public readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: AbstractValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return shallowEqual(this.props, vo.props);
  }

  protected static throwInvalidValue(message: string): InvalidValueException {
    throw new InvalidValueException(message);
  }
}
