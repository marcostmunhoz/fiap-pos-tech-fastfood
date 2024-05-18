import { ProductRepository } from '@/shared/domain/repository/product.repository.interface';

export const getProductRepositoryMock = (): jest.Mocked<ProductRepository> => ({
  list: jest.fn(),
  search: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  existsWithCode: jest.fn(),
  existsWithId: jest.fn(),
});
