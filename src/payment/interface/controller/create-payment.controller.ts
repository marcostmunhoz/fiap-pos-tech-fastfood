import {
  CardPaymentInput,
  CreatePaymentUseCase,
  PixPaymentInput,
} from '@/payment/application/use-case/create-payment.use-case';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentRequest } from '../dto/create-payment.request';
import { CreatePaymentResponse } from '../dto/create-payment.response';

@ApiTags('Payments')
@Controller('payments')
export class CreatePaymentController {
  constructor(private readonly useCase: CreatePaymentUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CreatePaymentResponse })
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Body() request: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    const input = request.cardData
      ? (request as CardPaymentInput)
      : (request as PixPaymentInput);
    const result = await this.useCase.execute(input);

    return mapObjectToResponse(CreatePaymentResponse, result);
  }
}
