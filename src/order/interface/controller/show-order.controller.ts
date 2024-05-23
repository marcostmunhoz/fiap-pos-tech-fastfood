import { ShowOrderUseCase } from '@/order/application/use-case/show-order.use-case';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import {
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderParam } from '../dto/order.param';
import { OrderResponse } from '../dto/order.response';

@ApiTags('Orders')
@Controller('orders')
export class ShowOrderController {
  constructor(
    @Inject(ShowOrderUseCase)
    private readonly useCase: ShowOrderUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: OrderResponse })
  @DefaultNotFoundResponse()
  @DefaultInternalServerErrorResponse()
  async execute(@Param() param: OrderParam): Promise<OrderResponse> {
    const result = await this.useCase.execute(param);

    return mapObjectToResponse(OrderResponse, result);
  }
}
