import { CustomerEntity } from './customer.entity';

describe('Customer', () => {
  it('should be defined', () => {
    expect(new CustomerEntity()).toBeDefined();
  });
});
