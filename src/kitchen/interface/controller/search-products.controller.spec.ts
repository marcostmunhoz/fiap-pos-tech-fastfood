import {
  Output,
  SearchProductsUseCase,
} from '@/kitchen/application/use-case/search-products.use-case';
import { getDomainCompleteProductEntityProps } from '@/testing/shared/helpers';
import { Test, TestingModule } from '@nestjs/testing';
import { SearchProductsController } from './search-products.controller';

describe('SearchProductsController', () => {
  let useCaseMock: jest.Mocked<SearchProductsUseCase>;
  let controller: SearchProductsController;

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SearchProductsUseCase>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SearchProductsUseCase,
          useValue: useCaseMock,
        },
      ],
      controllers: [SearchProductsController],
    }).compile();

    controller = module.get<SearchProductsController>(SearchProductsController);
  });

  describe('execute', () => {
    it('should return the existing products', async () => {
      // Arrange
      const props = getDomainCompleteProductEntityProps();
      const output: Output = [props];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      const response = await controller.execute({});

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({});
      expect(response).toHaveLength(1);
      expect(response[0]).toEqual({
        id: props.id.value,
        code: props.code.value,
        name: props.name.value,
        price: props.price.valueAsFloat,
        category: props.category,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      });
    });

    it('should filter by the query', async () => {
      // Arrange
      const props = getDomainCompleteProductEntityProps();
      const output: Output = [props];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      await controller.execute({ query: 'query' });

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({ query: 'query' });
    });

    it('should filter by the category', async () => {
      // Arrange
      const props = getDomainCompleteProductEntityProps();
      const output: Output = [props];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      await controller.execute({ category: props.category });

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        category: props.category,
      });
    });

    it('should filter by both the query and the category', async () => {
      // Arrange
      const props = getDomainCompleteProductEntityProps();
      const output: Output = [props];
      useCaseMock.execute.mockResolvedValue(output);

      // Act
      await controller.execute({ query: 'query', category: props.category });

      // Assert
      expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
      expect(useCaseMock.execute).toHaveBeenCalledWith({
        query: 'query',
        category: props.category,
      });
    });
  });
});
