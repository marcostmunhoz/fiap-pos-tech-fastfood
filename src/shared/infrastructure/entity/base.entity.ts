import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
