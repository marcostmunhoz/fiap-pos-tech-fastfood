import { BaseEntity } from '@/shared/infrastructure/entity/base.entity';
import { Column, Entity } from 'typeorm';

export type InputCustomerEntityProps = {
  name: string;
  email: string;
  cpf: string;
};

@Entity()
export class CustomerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;
}
