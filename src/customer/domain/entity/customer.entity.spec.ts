import {
  getDomainCompleteCustomerEntityProps,
  getDomainCustomerEntity,
} from '@/testing/customer/helpers';

describe('CustomerEntity', () => {
  describe('getters', () => {
    it('should return the correct values', async () => {
      // Arrange
      const props = getDomainCompleteCustomerEntityProps();
      const entity = getDomainCustomerEntity(props);

      // Assert
      expect(entity.id).toEqual(props.id);
      expect(entity.name).toEqual(props.name);
      expect(entity.email).toEqual(props.email);
      expect(entity.cpf).toEqual(props.cpf);
      expect(entity.createdAt).toEqual(props.createdAt);
      expect(entity.updatedAt).toEqual(props.updatedAt);
    });
  });
});
