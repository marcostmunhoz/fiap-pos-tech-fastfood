import {
  CardPaymentInput,
  CreatePaymentUseCase,
  PixPaymentInput,
} from '@/payment/application/use-case/create-payment.use-case';
import { UserEntity } from '@/shared/domain/entity/user.entity';
import { AuthUser } from '@/shared/infrastructure/decorator/auth-user.decorator';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { AuthGuard } from '@/shared/infrastructure/guard/auth.guard';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentRequest } from '../dto/create-payment.request';
import { CreatePaymentResponse } from '../dto/create-payment.response';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard)
export class CreatePaymentController {
  constructor(private readonly useCase: CreatePaymentUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreatePaymentResponse })
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @AuthUser() user: UserEntity,
    @Body() request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const input = {
      ...request,
      user,
    } as CardPaymentInput | PixPaymentInput;
    const result = await this.useCase.execute(input);

    return mapObjectToResponse(CreatePaymentResponse, result);
  }
}
