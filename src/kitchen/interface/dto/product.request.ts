import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import { TransformPrimitiveToValueObject } from '@/shared/infrastructure/decorator/class-transformer-helpers.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class ProductRequest {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  @TransformPrimitiveToValueObject(ProductCodeValueObject)
  @ApiProperty({
    example: 'PRD-001',
    type: String,
  })
  code: ProductCodeValueObject;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  @TransformPrimitiveToValueObject(ProductNameValueObject)
  @ApiProperty({
    example: 'Product Name',
    type: String,
  })
  name: ProductNameValueObject;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Transform(({ value }) => MoneyValueObject.createFromFloat(value))
  @ApiProperty({
    example: 10.99,
    type: Number,
  })
  price: MoneyValueObject;

  @IsNotEmpty()
  @IsEnum(ProductCategoryEnum)
  @ApiProperty({
    example: ProductCategoryEnum.DRINK,
    enum: ProductCategoryEnum,
  })
  category: ProductCategoryEnum;
}
