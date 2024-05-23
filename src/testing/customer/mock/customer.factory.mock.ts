import { CustomerFactory } from '@/customer/domain/factory/customer.factory';

export const getCustomerFactoryMock = (): jest.Mocked<CustomerFactory> =>
  ({
    createCustomer: jest.fn(),
  }) as unknown as jest.Mocked<CustomerFactory>;
