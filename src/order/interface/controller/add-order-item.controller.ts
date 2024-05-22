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
import { AddOrderItemUseCase } from '@/order/application/use-case/add-order-item.use-case';
import { OrderParam } from '../dto/order.param';
import { OrderItemRequest } from '../dto/order-item.request';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';

@ApiTags('Orders')
@Controller('orders')
export class AddOrderItemController {
  constructor(
    @Inject(AddOrderItemUseCase)
    private readonly useCase: AddOrderItemUseCase,
  ) {}

  @Post(':id/add-item')
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
