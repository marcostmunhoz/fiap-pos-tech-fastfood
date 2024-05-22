import { DomainException } from '@/shared/domain/exception/domain.exception';

export class ItemNotFoundException extends DomainException {
  constructor() {
    super('Item not found in the order.');
  }
}
