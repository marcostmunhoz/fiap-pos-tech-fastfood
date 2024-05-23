import { DomainException } from '@/shared/domain/exception/domain.exception';

export class InvalidPaymentMethodException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
