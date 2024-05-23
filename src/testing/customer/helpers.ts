import {
  CompleteCustomerEntityProps,
  CustomerEntity as DomainCustomerEntity,
  PartialCustomerEntityProps,
} from '@/customer/domain/entity/customer.entity';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { CustomerEntity as InfrastructureCustomerEntity } from '@/customer/infrastructure/entity/customer.entity';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';

export const getValidCustomerEntityId = (): EntityIdValueObject =>
  EntityIdValueObject.create('customer-id');

export const getValidCpf = (): CpfValueObject =>
  CpfValueObject.create('12345678909');

export const getValidFullName = (): FullNameValueObject =>
  FullNameValueObject.createFromFullName('John Doe');

export const getValidEmail = (): EmailValueObject =>
  EmailValueObject.create('john.doe@example.com');

export const getDomainPartialCustomerEntityProps =
  (): PartialCustomerEntityProps => ({
    name: getValidFullName(),
    email: getValidEmail(),
    cpf: getValidCpf(),
  });

export const getDomainCompleteCustomerEntityProps =
  (): CompleteCustomerEntityProps => ({
    id: getValidCustomerEntityId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...getDomainPartialCustomerEntityProps(),
  });

export const getDomainCustomerEntity = (
  props: Partial<CompleteCustomerEntityProps> = {},
): DomainCustomerEntity => {
  const defaultProps = getDomainCompleteCustomerEntityProps();

  return new DomainCustomerEntity({
    id: props.id || defaultProps.id,
    name: props.name || defaultProps.name,
    email: props.email || defaultProps.email,
    cpf: props.cpf || defaultProps.cpf,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  });
};

export const getInfrastructureCustomerEntity = (
  props: Partial<CompleteCustomerEntityProps> = {},
): InfrastructureCustomerEntity => {
  const defaultProps = getDomainCompleteCustomerEntityProps();

  return {
    id: props.id?.value || defaultProps.id.value,
    name: props.name?.value || defaultProps.name.value,
    email: props.email?.value || defaultProps.email.value,
    cpf: props.cpf?.value || defaultProps.cpf.value,
    createdAt: props.createdAt || defaultProps.createdAt,
    updatedAt: props.updatedAt || defaultProps.updatedAt,
  };
};
