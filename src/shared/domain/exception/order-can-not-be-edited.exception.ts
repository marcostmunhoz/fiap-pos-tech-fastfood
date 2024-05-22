import { DomainException } from '@/shared/domain/exception/domain.exception';

export class OrderCanNotBeEditedException extends DomainException {
  constructor() {
    super('Only pending orders can be edited.');
  }
}
