import { AbstractValueObject } from '@/shared/domain/value-object/abstract.value-object';

interface FullNameProps {
  firstName: string;
  lastName: string;
}

export class FullNameValueObject extends AbstractValueObject<FullNameProps> {
  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  public static createFromFullName(fullName: string): FullNameValueObject {
    const trimmedFullName = fullName.trim();

    if (!this.isValidFullName(trimmedFullName)) {
      throw new Error('Invalid name.');
    }

    const [firstName] = trimmedFullName.split(' ', 1);
    const lastName = trimmedFullName.substring(firstName.length).trim();

    return new FullNameValueObject({ firstName, lastName });
  }

  public static createFromNameParts(
    firstName: string,
    lastName: string,
  ): FullNameValueObject {
    const fullName = `${firstName} ${lastName}`;

    return this.createFromFullName(fullName);
  }

  private static isValidFullName(fullName: string): boolean {
    if (fullName === null || fullName === undefined) {
      return false;
    }

    if (
      !fullName.includes(' ') ||
      fullName.length < 2 ||
      fullName.length > 100
    ) {
      return false;
    }

    return true;
  }
}
