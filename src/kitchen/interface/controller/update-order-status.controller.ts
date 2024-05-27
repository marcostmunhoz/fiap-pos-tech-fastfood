import { UpdateOrderStatusUseCase } from '@/kitchen/application/use-case/update-order-status.use-case';
import { OrderParam } from '@/order/interface/dto/order.param';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrderStatusRequest } from '../dto/update-order-status.request';

@ApiTags('Orders')
@Controller('orders')
@UuidParam({ name: 'id' })
@DefaultBadRequestResponse()
@DefaultNotFoundResponse()
@DefaultUnprocessableEntityResponse()
@DefaultInternalServerErrorResponse()
export class UpdateOrderStatusController {
  constructor(private readonly useCase: UpdateOrderStatusUseCase) {}

  @Put(':id/status')
  @HttpCode(204)
  async execute(
    @Param() param: OrderParam,
    @Body() request: UpdateOrderStatusRequest,
  ): Promise<void> {
    await this.useCase.execute({
      id: param.id,
      data: {
        status: request.status,
      },
    });
  }
}
