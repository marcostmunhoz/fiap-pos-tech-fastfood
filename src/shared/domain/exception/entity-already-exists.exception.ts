import { DomainException } from './domain.exception';

export class EntityAlreadyExistsException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
