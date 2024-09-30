import { ShowOrderUseCase } from '@/order/application/use-case/show-order.use-case';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { AuthUser } from '@/shared/infrastructure/decorator/auth-user.decorator';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import {
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { AuthGuard } from '@/shared/infrastructure/guard/auth.guard';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderParam } from '../dto/order.param';
import { OrderResponse } from '../dto/order.response';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class ShowOrderController {
  constructor(
    @Inject(ShowOrderUseCase)
    private readonly useCase: ShowOrderUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: OrderResponse })
  @DefaultNotFoundResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @AuthUser() user: UserEntity,
    @Param() param: OrderParam,
  ): Promise<OrderResponse> {
    const result = await this.useCase.execute({ ...param, user });

    return mapObjectToResponse(OrderResponse, result);
  }
}
