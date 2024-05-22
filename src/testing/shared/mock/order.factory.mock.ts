import { OrderFactory } from '@/shared/domain/factory/order.factory';

export const getOrderFactoryMock = (): jest.Mocked<OrderFactory> =>
  ({
    createOrder: jest.fn(),
  }) as unknown as jest.Mocked<OrderFactory>;
