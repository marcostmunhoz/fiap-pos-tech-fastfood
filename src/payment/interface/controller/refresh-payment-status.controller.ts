import { RefreshPaymentStatusUseCase } from '@/payment/application/use-case/refresh-payment-status.use-case';
import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaymentParam } from '../dto/payment.param';
import { RefreshPaymentStatusResponse } from '../dto/refresh-payment-status.response';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';

@ApiTags('Payments')
@Controller('payments')
export class RefreshPaymentStatusController {
  constructor(private readonly useCase: RefreshPaymentStatusUseCase) {}

  @Post(':id/refresh-status')
  @HttpCode(200)
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: RefreshPaymentStatusResponse })
  @DefaultBadRequestResponse()
  @DefaultNotFoundResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: PaymentParam,
  ): Promise<RefreshPaymentStatusResponse> {
    const result = await this.useCase.execute(param);

    return mapObjectToResponse(RefreshPaymentStatusResponse, result);
  }
}
