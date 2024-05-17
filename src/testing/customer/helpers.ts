import {
  CustomerEntity as DomainCustomerEntity,
  CustomerEntityProps,
} from '@/customer/domain/entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import {
  InputCustomerEntityProps,
  CustomerEntity as InfrastructureCustomerEntity,
} from '@/customer/infrastructure/entity/customer.entity';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';

export function getValidCpf(): CpfValueObject {
  return CpfValueObject.create('57516713090');
}

export function getValidFullName(): FullNameValueObject {
  return FullNameValueObject.createFromFullName('John Doe');
}

export function getValidEmail(): EmailValueObject {
  return EmailValueObject.create('john.doe@example.com');
}

export function getCustomerDomainEntityProps(): CustomerEntityProps {
  return {
    name: getValidFullName(),
    email: getValidEmail(),
    cpf: getValidCpf(),
  };
}

export function getCustomerDomainEntity(
  props?: CustomerEntityProps,
): DomainCustomerEntity {
  return DomainCustomerEntity.create({
    id: EntityIdValueObject.create('customer-id'),
    ...(props || getCustomerDomainEntityProps()),
  });
}

export function getCustomerInfrastructureEntityProps(): InputCustomerEntityProps {
  return {
    name: getValidFullName().value,
    email: getValidEmail().value,
    cpf: getValidCpf().value,
  };
}

export function getCustomerInfrastructureEntity(
  props?: InputCustomerEntityProps,
): InfrastructureCustomerEntity {
  return {
    id: 'customer-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getCustomerInfrastructureEntityProps()),
  };
}
