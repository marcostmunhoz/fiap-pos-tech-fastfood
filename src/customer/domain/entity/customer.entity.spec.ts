import { CustomerEntity } from './customer.entity';
import { getDomainCustomerEntityPropsWithId } from '@/testing/customer/helpers';

describe('CustomerEntity', () => {
  describe('create', () => {
    it('should return a new Customer instance', async () => {
      // Arrange
      const props = getDomainCustomerEntityPropsWithId();

      // Act
      const result = CustomerEntity.create(props);

      // Assert
      expect(result).toBeInstanceOf(CustomerEntity);
      expect(result).toEqual(props);
    });
  });
});
