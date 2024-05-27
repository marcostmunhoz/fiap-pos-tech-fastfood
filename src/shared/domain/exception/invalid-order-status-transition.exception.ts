import { DomainException } from '@/shared/domain/exception/domain.exception';

export class InvalidOrderStatusTransitionException extends DomainException {
  constructor(oldStatus: string, newStatus: string) {
    super(`Invalid transition from ${oldStatus} to ${newStatus}.`);
  }
}
