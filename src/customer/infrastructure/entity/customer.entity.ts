import { BaseEntity } from '@/shared/infrastructure/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerEntity extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  cpf?: string;
}
