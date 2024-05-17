import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @Transform(({ value }) => FullNameValueObject.createFromFullName(value))
  name: FullNameValueObject;

  @IsNotEmpty()
  @Transform(({ value }) => EmailValueObject.create(value))
  email: EmailValueObject;

  @IsNotEmpty()
  @Transform(({ value }) => CpfValueObject.create(value))
  cpf: CpfValueObject;
}
