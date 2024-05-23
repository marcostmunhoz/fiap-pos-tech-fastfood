import { FindCustomerByCpfUseCase } from '@/customer/application/use-case/find-customer-by-cpf.use-case';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import {
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomerResponse } from '../dto/customer.response';
import { FindCustomerByCpfPathParam } from '../dto/find-customer-by-cpf.request';

@ApiTags('Customers')
@Controller('customers')
export class FindCustomerByCpfController {
  constructor(
    @Inject(FindCustomerByCpfUseCase)
    private readonly useCase: FindCustomerByCpfUseCase,
  ) {}

  @Get(':cpf')
  @HttpCode(200)
  @ApiOkResponse({ type: CustomerResponse })
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  @DefaultNotFoundResponse()
  @ApiParam({
    name: 'cpf',
    example: '12345678909',
  })
  async execute(
    @Param() param: FindCustomerByCpfPathParam,
  ): Promise<CustomerResponse> {
    const result = await this.useCase.execute(param);

    if (!result) {
      throw new NotFoundException();
    }

    return mapObjectToResponse(CustomerResponse, result);
  }
}
