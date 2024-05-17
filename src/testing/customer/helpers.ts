import {
  CustomerEntity as DomainCustomerEntity,
  CustomerEntityProps,
  EssentialCustomerEntityProps as DomainEssentialCustomerEntityProps,
  CustomerEntityPropsWithId,
  EssentialCustomerEntityProps,
} from '@/customer/domain/entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import {
  EssentialCustomerEntityProps as InfrastructureEssentialCustomerEntityProps,
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

export function getDomainEssentialCustomerEntityProps(): DomainEssentialCustomerEntityProps {
  return {
    name: getValidFullName(),
    email: getValidEmail(),
    cpf: getValidCpf(),
  };
}

export function getDomainCustomerEntityProps(): CustomerEntityProps {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainEssentialCustomerEntityProps(),
  };
}

export function getDomainCustomerEntityPropsWithId(): CustomerEntityPropsWithId {
  return {
    id: EntityIdValueObject.create('customer-id'),
    ...getDomainCustomerEntityProps(),
  };
}

export function getDomainCustomerEntity(
  props?: EssentialCustomerEntityProps,
): DomainCustomerEntity {
  return DomainCustomerEntity.create({
    id: EntityIdValueObject.create('customer-id'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getDomainEssentialCustomerEntityProps()),
  });
}

export function getInfrastructureEssentialCustomerEntityProps(): InfrastructureEssentialCustomerEntityProps {
  return {
    name: getValidFullName().value,
    email: getValidEmail().value,
    cpf: getValidCpf().value,
  };
}

export function getCustomerInfrastructureEntity(
  props?: InfrastructureEssentialCustomerEntityProps,
): InfrastructureCustomerEntity {
  return {
    id: 'customer-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(props || getInfrastructureEssentialCustomerEntityProps()),
  };
}
