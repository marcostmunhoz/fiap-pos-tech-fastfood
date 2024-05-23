import { AbstractEntity } from '@/shared/domain/entity/abstract.entity';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { CpfValueObject } from '../value-object/cpf.value-object';
import { EmailValueObject } from '../value-object/email.value-object';
import { FullNameValueObject } from '../value-object/full-name.value-object';

export type PartialCustomerEntityProps = {
  name?: FullNameValueObject;
  email?: EmailValueObject;
  cpf?: CpfValueObject;
};

export type CompleteCustomerEntityProps = {
  id: EntityIdValueObject;
  name?: FullNameValueObject;
  email?: EmailValueObject;
  cpf?: CpfValueObject;
  createdAt: Date;
  updatedAt: Date;
};

export class CustomerEntity extends AbstractEntity<CompleteCustomerEntityProps> {
  public get name(): FullNameValueObject | null {
    return this.props.name;
  }

  public get email(): EmailValueObject | null {
    return this.props.email;
  }

  public get cpf(): CpfValueObject | null {
    return this.props.cpf;
  }
}
