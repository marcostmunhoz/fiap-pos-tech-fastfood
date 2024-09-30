import { CreateOrderUseCase } from '@/order/application/use-case/create-order.use-case';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { AuthUser } from '@/shared/infrastructure/decorator/auth-user.decorator';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { AuthGuard } from '@/shared/infrastructure/guard/auth.guard';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Controller, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderResponse } from '../dto/create-order.response';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class CreateOrderController {
  constructor(
    @Inject(CreateOrderUseCase)
    private readonly useCase: CreateOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreateOrderResponse })
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(@AuthUser() user: UserEntity): Promise<CreateOrderResponse> {
    const result = await this.useCase.execute(user);

    return mapObjectToResponse(CreateOrderResponse, result);
  }
}
