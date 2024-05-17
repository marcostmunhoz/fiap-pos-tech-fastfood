import { AbstractValueObject } from '@/shared/domain/value-object/abstract.value-object';

type EmailProps = {
  value: string;
};

export class EmailValueObject extends AbstractValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(email: string): EmailValueObject {
    if (!this.isValidEmail(email)) {
      this.throwInvalidValue('Invalid email address.');
    }

    return new EmailValueObject({ value: email });
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }
}
