import { UuidProperty } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsString()
  @UuidProperty()
  customerId: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  customerName: string;
}
