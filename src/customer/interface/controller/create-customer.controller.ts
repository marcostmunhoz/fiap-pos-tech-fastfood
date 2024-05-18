import { CreateCustomerUseCase } from '@/customer/application/use-case/create-customer.use-case';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.request';
import { CustomerResponse } from '../dto/customer.response';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';

@ApiTags('Customers')
@Controller('customers')
export class CreateCustomerController {
  constructor(
    @Inject(CreateCustomerUseCase)
    private readonly useCase: CreateCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: CustomerResponse })
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Body() request: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    const result = await this.useCase.execute(request);

    return mapObjectToResponse(CustomerResponse, result);
  }
}
