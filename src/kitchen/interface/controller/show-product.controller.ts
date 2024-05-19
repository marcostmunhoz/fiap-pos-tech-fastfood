import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductResponse } from '../dto/product.response';
import {
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { mapObjectToResponse } from '@/shared/infrastructure/helper/response.helper';
import { ProductParam } from '../dto/product.param';
import { ShowProductUseCase } from '@/kitchen/application/use-case/show-product.use-case';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';

@ApiTags('Products')
@Controller('products')
export class ShowProductController {
  constructor(
    @Inject(ShowProductUseCase)
    private readonly useCase: ShowProductUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @UuidParam({ name: 'id' })
  @ApiOkResponse({ type: ProductResponse })
  @DefaultInternalServerErrorResponse()
  @DefaultNotFoundResponse()
  async execute(@Param() param: ProductParam): Promise<ProductResponse> {
    const result = await this.useCase.execute(param);

    return mapObjectToResponse(ProductResponse, result);
  }
}
