import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { CustomerEntity, CustomerEntityPropsWithId } from './customer.entity';

describe('CustomerEntity', () => {
  describe('create', () => {
    it('should return a new Customer instance', async () => {
      // Arrange
      const props: CustomerEntityPropsWithId = {
        id: EntityIdValueObject.create('some-id'),
        fullName: FullNameValueObject.createFromFullName('John Doe'),
        cpf: CpfValueObject.create('57516713090'),
        email: EmailValueObject.create('john.doe@example.com'),
      };

      // Act
      const result = CustomerEntity.create(props);

      // Assert
      expect(result).toBeInstanceOf(CustomerEntity);
      expect(result).toEqual(props);
    });
  });
});
