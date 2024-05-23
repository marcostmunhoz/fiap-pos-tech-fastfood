import { EntityIdGeneratorHelper } from '@/shared/domain/helper/entity-id-generator.helper.interface';
import {
  getDomainPartialCustomerEntityProps,
  getValidCustomerEntityId,
} from '@/testing/customer/helpers';
import { getEntityIdGeneratorHelperMock } from '@/testing/shared/mock/entity-id-generator.helper.mock';
import { CustomerEntity } from '../entity/customer.entity';
import { CustomerFactory } from './customer.factory';

describe('CustomerFactory', () => {
  let entityIdGeneratorMock: jest.Mocked<EntityIdGeneratorHelper>;
  let sut: CustomerFactory;

  beforeEach(() => {
    entityIdGeneratorMock = getEntityIdGeneratorHelperMock();
    sut = new CustomerFactory(entityIdGeneratorMock);
  });

  describe('createCustomer', () => {
    it('should create an instance of the customer entity', () => {
      // Arrange
      const props = getDomainPartialCustomerEntityProps();
      const id = getValidCustomerEntityId();
      entityIdGeneratorMock.generate.mockReturnValue(id);
      const expectedDate = new Date();
      const dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => expectedDate);

      // Act
      const entity = sut.createCustomer(props);

      // Assert
      expect(entityIdGeneratorMock.generate).toHaveBeenCalledTimes(1);
      expect(dateSpy).toHaveBeenCalledTimes(2);
      expect(entity).toBeInstanceOf(CustomerEntity);
      expect(entity.id).toEqual(id);
      expect(entity.name).toEqual(props.name);
      expect(entity.email).toEqual(props.email);
      expect(entity.cpf).toEqual(props.cpf);
      expect(entity.createdAt).toEqual(expectedDate);
      expect(entity.updatedAt).toEqual(expectedDate);
    });
  });
});
