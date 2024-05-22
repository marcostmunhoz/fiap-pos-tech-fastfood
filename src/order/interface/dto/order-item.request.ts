import { ItemQuantityValueObject } from '@/shared/domain/value-object/item-quantity.value-object';
import { TransformPrimitiveToValueObject } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'PRD-001',
    type: String,
  })
  productCode: string;

  @IsNotEmpty()
  @IsNumber()
  @TransformPrimitiveToValueObject(ItemQuantityValueObject)
  @ApiProperty({
    example: 1,
    type: Number,
  })
  quantity: ItemQuantityValueObject;
}
