import { OrderRepository } from '@/shared/domain/repository/order.repository.interface';

export const getOrderRepositoryMock = (): jest.Mocked<OrderRepository> => ({
  findById: jest.fn(),
  save: jest.fn(),
  listAscendingByUpdatedAt: jest.fn(),
});
