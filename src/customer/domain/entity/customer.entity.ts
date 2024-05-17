import { EmailValueObject } from '../value-object/email.value-object';
import { FullNameValueObject } from '../value-object/full-name.value-object';
import { CpfValueObject } from '../value-object/cpf.value-object';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';

export type CustomerEntityProps = {
  name?: FullNameValueObject;
  email?: EmailValueObject;
  cpf?: CpfValueObject;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CustomerEntityPropsWithId = CustomerEntityProps & {
  id: EntityIdValueObject;
};

export class CustomerEntity {
  public readonly id: EntityIdValueObject;
  public readonly name?: FullNameValueObject;
  public readonly email?: EmailValueObject;
  public readonly cpf?: CpfValueObject;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  private constructor(props: CustomerEntityPropsWithId) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.cpf = props.cpf;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: CustomerEntityPropsWithId): CustomerEntity {
    const entity = new CustomerEntity(props);

    return entity;
  }
}
