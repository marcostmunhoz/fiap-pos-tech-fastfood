import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export type EssentialProductEntityProps = {
  id: string;
  code: string;
  name: string;
  price: number;
  category: string;
};

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  category: string;
}
