import { RemoveOrderItemUseCase } from '@/order/application/use-case/remove-order-item.use-case';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { AuthUser } from '@/shared/infrastructure/decorator/auth-user.decorator';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { AuthGuard } from '@/shared/infrastructure/guard/auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { OrderParam } from '../dto/order.param';
import { RemoveOrderItemRequest } from '../dto/remove-order-item.request';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard)
export class RemoveOrderItemController {
  constructor(
    @Inject(RemoveOrderItemUseCase)
    private readonly useCase: RemoveOrderItemUseCase,
  ) {}

  @Post(':id/remove-item')
  @HttpCode(204)
  @ApiBearerAuth()
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @AuthUser() user: UserEntity,
    @Param() param: OrderParam,
    @Body() request: RemoveOrderItemRequest,
  ): Promise<void> {
    await this.useCase.execute({
      id: param.id,
      data: request,
      user,
    });
  }
}
