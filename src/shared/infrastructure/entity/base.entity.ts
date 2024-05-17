import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
