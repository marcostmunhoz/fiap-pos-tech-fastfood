import { DomainException } from '@/shared/domain/exception/domain.exception';

export class PaymentCanNotBeEditedException extends DomainException {
  constructor() {
    super('Only pending payments can be edited.');
  }
}
