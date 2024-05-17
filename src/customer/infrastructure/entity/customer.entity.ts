import { BaseEntity } from '@/shared/infrastructure/entity/base.entity';
import { Column, Entity } from 'typeorm';

export type EssentialCustomerEntityProps = {
  id: string;
  name: string;
  email: string;
  cpf: string;
};

@Entity({ name: 'customers' })
export class CustomerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;
}
