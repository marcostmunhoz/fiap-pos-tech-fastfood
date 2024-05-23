import { DomainException } from '@/shared/domain/exception/domain.exception';

export class InvalidPaymentStatusException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
