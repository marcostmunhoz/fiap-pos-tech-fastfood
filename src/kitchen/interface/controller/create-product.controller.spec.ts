import {
  CreateProductUseCase,
  Output,
} from '@/kitchen/application/use-case/create-product.use-case';
import {
  getDomainCompleteProductEntityProps,
  getValidMoney,
  getValidProductCategory,
  getValidProductCode,
  getValidProductName,
} from '@/testing/shared/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductRequest } from '../dto/product.request';
import { CreateProductController } from './create-product.controller';

describe('CreateProductController', () => {
  let useCaseMock: jest.Mocked<CreateProductUseCase>;
  let controller: CreateProductController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateProductUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateProductUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [CreateProductController],
    }).compile();

    controller = module.get<CreateProductController>(CreateProductController);
  });

  describe('execute', () => {
    it('should return the created product', async () => {
      // Arrange
      const request: ProductRequest = {
        code: getValidProductCode(),
        name: getValidProductName(),
        price: getValidMoney(),
        category: getValidProductCategory(),
      };
      const output: Output = getDomainCompleteProductEntityProps();
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute(request);

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith(request);
      expect(response).toEqual({
        id: output.id.value,
        code: output.code.value,
        name: output.name.value,
        price: output.price.valueAsFloat,
        category: output.category,
        createdAt: output.createdAt,
        updatedAt: output.updatedAt,
      });
    });
  });
});
