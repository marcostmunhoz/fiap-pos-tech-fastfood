import { CreateCustomerUseCase } from '@/customer/application/use-case/create-customer.use-case';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.request';
import { plainToClass } from 'class-transformer';
import { CustomerResponse } from '../dto/customer.response';

@Controller('customers')
export class CreateCustomerController {
  constructor(
    @Inject(CreateCustomerUseCase)
    private readonly useCase: CreateCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async execute(
    @Body() request: CreateCustomerRequest,
  ): Promise<CustomerResponse> {
    const result = await this.useCase.execute(request);

    return plainToClass(CustomerResponse, result, {
      excludeExtraneousValues: true,
    });
  }
}
