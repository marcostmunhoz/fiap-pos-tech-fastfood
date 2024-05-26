import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListProductsResponse {
  @Expose()
  @ApiProperty({
    enum: ProductCategoryEnum,
    example: ProductCategoryEnum.DRINK,
  })
  category: string;

  @Expose()
  @ApiProperty({
    example: [
      {
        code: 'PRD-001',
        name: 'Product Name',
        description: 'Product Description',
        price: 10.99,
      },
    ],
  })
  products: Array<{
    code: string;
    name: string;
    description: string;
    price: number;
  }>;
}
