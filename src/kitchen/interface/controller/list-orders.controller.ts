import { ListOrdersUseCase } from '@/kitchen/application/use-case/list-orders.use-case';
import { DefaultInternalServerErrorResponse } from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListOrdersResponse } from '../dto/list-orders.response';

@ApiTags('Orders')
@Controller('orders')
export class ListOrdersController {
  constructor(private readonly useCase: ListOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: ListOrdersResponse, isArray: true })
  @DefaultInternalServerErrorResponse()
  async execute(): Promise<ListOrdersResponse[]> {
    const result = this.useCase.execute();

    return mapObjectToResponse(
      ListOrdersResponse,
      result,
    ) as unknown as ListOrdersResponse[];
  }
}
