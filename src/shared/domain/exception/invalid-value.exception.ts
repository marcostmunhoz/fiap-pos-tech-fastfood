import { DomainException } from './domain.exception';

export class InvalidValueException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
