import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @Transform(({ value }) => FullNameValueObject.createFromFullName(value))
  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  name: FullNameValueObject;

  @IsNotEmpty()
  @Transform(({ value }) => EmailValueObject.create(value))
  @ApiProperty({
    example: 'john.doe@example.com',
    type: String,
  })
  email: EmailValueObject;

  @IsNotEmpty()
  @Transform(({ value }) => CpfValueObject.create(value))
  @ApiProperty({
    example: '12345678909',
    type: String,
  })
  cpf: CpfValueObject;
}
