import { CreateOrderUseCase } from '@/order/application/use-case/create-order.use-case';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderRequest } from '../dto/create-order.request';
import { CreateOrderResponse } from '../dto/create-order.response';

@ApiTags('Orders')
@Controller('orders')
export class CreateOrderController {
  constructor(
    @Inject(CreateOrderUseCase)
    private readonly useCase: CreateOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CreateOrderResponse })
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Body() request: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    const result = await this.useCase.execute(request);

    return mapObjectToResponse(CreateOrderResponse, result);
  }
}
