import { OrderStatusEnum } from '@/shared/domain/enum/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusRequest {
  @IsNotEmpty()
  @IsEnum(OrderStatusEnum)
  @ApiProperty({
    enum: [
      OrderStatusEnum.PREPARING,
      OrderStatusEnum.READY,
      OrderStatusEnum.DELIVERED,
    ],
    example: OrderStatusEnum.PREPARING,
  })
  status:
    | OrderStatusEnum.PREPARING
    | OrderStatusEnum.READY
    | OrderStatusEnum.DELIVERED;
}
