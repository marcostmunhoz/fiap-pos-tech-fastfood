import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => FullNameValueObject.createFromFullName(value))
  @ApiProperty({
    example: 'John Doe',
    type: String,
    required: false,
  })
  name?: FullNameValueObject;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => EmailValueObject.create(value))
  @ApiProperty({
    example: 'john.doe@example.com',
    type: String,
    required: false,
  })
  email?: EmailValueObject;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => CpfValueObject.create(value))
  @ApiProperty({
    example: '12345678909',
    type: String,
    required: false,
  })
  cpf?: CpfValueObject;
}
