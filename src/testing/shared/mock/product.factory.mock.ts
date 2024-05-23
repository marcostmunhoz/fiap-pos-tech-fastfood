import { ProductFactory } from '@/shared/domain/factory/product.factory';

export const getProductFactoryMock = (): jest.Mocked<ProductFactory> =>
  ({
    createProduct: jest.fn(),
  }) as unknown as jest.Mocked<ProductFactory>;
