import { DomainException } from '@/shared/domain/exception/domain.exception';

export class PaymentFailedException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
