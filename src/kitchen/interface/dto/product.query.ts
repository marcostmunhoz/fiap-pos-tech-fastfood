import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProductQuery {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(ProductCategoryEnum)
  category?: ProductCategoryEnum;
}
