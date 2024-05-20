import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import {
  TransformPrimitiveToValueObject,
  TransformOptional,
} from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerRequest {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @TransformOptional((value) => FullNameValueObject.createFromFullName(value))
  @ApiProperty({
    example: 'John Doe',
    type: String,
    required: false,
  })
  name?: FullNameValueObject;

  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  @TransformPrimitiveToValueObject(EmailValueObject)
  @ApiProperty({
    example: 'john.doe@example.com',
    type: String,
    required: false,
  })
  email?: EmailValueObject;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @TransformPrimitiveToValueObject(CpfValueObject)
  @ApiProperty({
    example: '12345678909',
    type: String,
    required: false,
  })
  cpf?: CpfValueObject;
}
