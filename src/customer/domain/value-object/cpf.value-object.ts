import { AbstractValueObject } from '@/shared/domain/value-object/abstract.value-object';

interface CpfValueObjectProps {
  value: string;
}

export class CpfValueObject extends AbstractValueObject<CpfValueObjectProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(cpf: string): CpfValueObject {
    const cleanCpf = cpf.replace(/\D/g, '');

    if (!this.isValidCpf(cleanCpf)) {
      throw new Error('Invalid CPF.');
    }

    return new CpfValueObject({ value: cleanCpf });
  }

  private static isValidCpf(cpf: string): boolean {
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }

    const checkDigit1 = parseInt(cpf.charAt(9));
    const checkDigit2 = parseInt(cpf.charAt(10));

    let sum = 0;
    let weight = 10;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * weight;
      weight--;
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10) {
      remainder = 0;
    }

    if (remainder !== checkDigit1) {
      return false;
    }

    sum = 0;
    weight = 11;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * weight;
      weight--;
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10) {
      remainder = 0;
    }

    if (remainder !== checkDigit2) {
      return false;
    }

    return true;
  }
}
