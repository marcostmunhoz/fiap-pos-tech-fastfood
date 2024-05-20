import { Expose } from 'class-transformer';
import {
  TransformObjectKeyOptional,
  TransformValueObjectToPrimitive,
} from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { UuidProperty } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';

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
