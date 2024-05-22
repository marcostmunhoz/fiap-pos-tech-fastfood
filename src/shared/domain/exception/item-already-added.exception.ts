import { DomainException } from '@/shared/domain/exception/domain.exception';

export class ItemAlreadyAddedException extends DomainException {
  constructor() {
    super('Item already exists in the order.');
  }
}
