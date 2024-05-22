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
import { RemoveOrderItemUseCase } from '@/order/application/use-case/remove-order-item.use-case';
import { OrderParam } from '../dto/order.param';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { RemoveOrderItemRequest } from '../dto/remove-order-item.request';

@ApiTags('Orders')
@Controller('orders')
export class RemoveOrderItemController {
  constructor(
    @Inject(RemoveOrderItemUseCase)
    private readonly useCase: RemoveOrderItemUseCase,
  ) {}

  @Post(':id/remove-item')
  @HttpCode(204)
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: OrderParam,
    @Body() request: RemoveOrderItemRequest,
  ): Promise<void> {
    await this.useCase.execute({ id: param.id, data: request });
  }
}
