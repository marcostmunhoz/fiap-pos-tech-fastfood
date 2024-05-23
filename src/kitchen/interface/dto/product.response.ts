import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import {
  TransformObjectKeyOptional,
  TransformValueObjectToPrimitive,
} from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { UuidProperty } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductResponse {
  @Expose()
  @TransformValueObjectToPrimitive()
  @UuidProperty()
  id: string;

  @Expose()
  @TransformValueObjectToPrimitive()
  @ApiProperty({
    example: 'PRD-001',
  })
  code: string;

  @Expose()
  @TransformValueObjectToPrimitive()
  @ApiProperty({
    example: 'Product Name',
  })
  name: string;

  @Expose()
  @TransformValueObjectToPrimitive()
  @ApiProperty({
    example: 'Product Description',
  })
  description: string;

  @Expose()
  @TransformObjectKeyOptional((obj) => (obj as MoneyValueObject).valueAsFloat)
  @ApiProperty({
    example: 10.99,
  })
  price: number;

  @Expose()
  @ApiProperty({
    example: ProductCategoryEnum.DRINK,
    enum: ProductCategoryEnum,
  })
  category: string;

  @Expose()
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
