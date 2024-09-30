import { DomainException } from './domain.exception';

export class UnauthorizedResourceException extends DomainException {
  constructor() {
    super('Unauthorized resource.');
  }
}
