import { Body, Controller, HttpCode, Inject, Param, Put } from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { ProductParam } from '../dto/product.param';
import { UpdateProductUseCase } from '@/kitchen/application/use-case/update-product.use-case';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';
import { ProductRequest } from '../dto/product.request';

@ApiTags('Products')
@Controller('products')
export class UpdateProductController {
  constructor(
    @Inject(UpdateProductUseCase)
    private readonly useCase: UpdateProductUseCase,
  ) {}

  @Put(':id')
  @HttpCode(204)
  @UuidParam({ name: 'id' })
  @ApiNoContentResponse()
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  async execute(
    @Param() param: ProductParam,
    @Body() request: ProductRequest,
  ): Promise<void> {
    await this.useCase.execute({ id: param.id, data: request });
  }
}
