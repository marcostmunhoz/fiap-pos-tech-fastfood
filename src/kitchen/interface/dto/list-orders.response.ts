import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

class ListOrdersItem {
  @Expose()
  id: string;

  @Expose()
  customerName?: string;

  @Expose()
  items: Array<{
    code: string;
    name: string;
    price: number;
    quantity: number;
  }>;

  @Expose()
  updatedAt: Date;
}

export class ListOrdersResponse {
  @Expose()
  @IsEnum(OrderStatusEnum)
  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.PAID,
  })
  status: string;

  @Expose()
  @Type(() => ListOrdersItem)
  @ApiProperty({
    example: {
      id: '053b636d-aaa3-4700-9ead-fe9cfd20507f',
      customerName: 'John Doe',
      items: [
        {
          code: 'PRD-001',
          name: 'Product Name',
          price: 10.99,
          quantity: 2,
        },
      ],
      updatedAt: new Date(),
    },
  })
  orders: ListOrdersItem[];
}
