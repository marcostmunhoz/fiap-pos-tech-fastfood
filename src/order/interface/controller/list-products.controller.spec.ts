import { Test, TestingModule } from '@nestjs/testing';
import { ListProductsController } from './list-products.controller';
import {
  ListProductsUseCase,
  Output,
} from '@/order/application/use-case/list-products.use-case';
import { getDomainProductEntity } from '@/testing/shared/helpers';

describe('ListProductsController', () => {
  let useCaseMock: jest.Mocked<ListProductsUseCase>;
  let controller: ListProductsController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListProductsUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListProductsUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [ListProductsController],
    }).compile();

    controller = module.get<ListProductsController>(ListProductsController);
  });

  describe('execute', () => {
    it('should return the existing products grouped by categories', async () => {
      // Arrange
      const product = getDomainProductEntity();
      const output: Output = [
        {
          category: product.category,
          products: [
            {
              code: product.code.value,
              name: product.name.value,
              price: product.price.valueAsFloat,
            },
          ],
        },
      ];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute();

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith();
      expect(response).toHaveLength(1);
      expect(response).toEqual(output);
    });
  });
});
