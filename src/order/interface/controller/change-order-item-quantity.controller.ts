import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { ChangeOrderItemQuantityUseCase } from '@/order/application/use-case/change-order-item-quantity.use-case';
import { OrderParam } from '../dto/order.param';
import { OrderItemRequest } from '../dto/order-item.request';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';

@ApiTags('Orders')
@Controller('orders')
export class ChangeOrderItemQuantityController {
  constructor(
    @Inject(ChangeOrderItemQuantityUseCase)
    private readonly useCase: ChangeOrderItemQuantityUseCase,
  ) {}

  @Post(':id/change-item-quantity')
  @HttpCode(204)
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: OrderParam,
    @Body() request: OrderItemRequest,
  ): Promise<void> {
    await this.useCase.execute({ id: param.id, data: request });
  }
}
