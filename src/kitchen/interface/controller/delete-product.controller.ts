import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  DefaultBadRequestResponse,
  DefaultInternalServerErrorResponse,
  DefaultNotFoundResponse,
  DefaultUnprocessableEntityResponse,
} from '@/shared/infrastructure/decorator/swagger-response.decorator';
import { ProductParam } from '../dto/product.param';
import { DeleteProductUseCase } from '@/kitchen/application/use-case/delete-product.use-case';
import { UuidParam } from '@/shared/infrastructure/decorator/swagger-property.decorator';

@ApiTags('Products')
@Controller('products')
export class DeleteProductController {
  constructor(
    @Inject(DeleteProductUseCase)
    private readonly useCase: DeleteProductUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  @UuidParam({ name: 'id' })
  @ApiOkResponse()
  @DefaultBadRequestResponse()
  @DefaultUnprocessableEntityResponse()
  @DefaultInternalServerErrorResponse()
  @DefaultNotFoundResponse()
  async execute(@Param() param: ProductParam): Promise<void> {
    await this.useCase.execute(param);
  }
}
