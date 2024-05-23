import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsResponse } from '../dto/list-products.response';
import { DefaultInternalServerErrorResponse } from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { ListProductsUseCase } from '@/order/application/use-case/list-products.use-case';

@ApiTags('Orders')
@Controller('orders')
export class ListProductsController {
  constructor(
    @Inject(ListProductsUseCase)
    private readonly useCase: ListProductsUseCase,
  ) {}

  @Get('products')
  @HttpCode(200)
  @ApiOkResponse({ type: ListProductsResponse, isArray: true })
  @DefaultInternalServerErrorResponse()
  async execute(): Promise<ListProductsResponse[]> {
    const result = await this.useCase.execute();

    return mapObjectToResponse(
      ListProductsResponse,
      result,
    ) as unknown as ListProductsResponse[];
  }
}
