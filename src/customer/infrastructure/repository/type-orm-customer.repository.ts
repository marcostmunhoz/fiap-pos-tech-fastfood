import {
  CustomerEntity as DomainCustomerEntity,
  CustomerEntityProps,
} from '@/customer/domain/entity/customer.entity';
import {
  InputCustomerEntityProps,
  CustomerEntity as InfrastructureCustomerEntity,
} from '../entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { Repository } from 'typeorm';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(InfrastructureCustomerEntity)
    private readonly typeOrmRepository: Repository<InfrastructureCustomerEntity>,
  ) {}

  async findByCpf(cpf: CpfValueObject): Promise<DomainCustomerEntity> {
    const dbEntity = await this.typeOrmRepository.findOne({
      where: {
        cpf: cpf.value,
      },
    });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async create(props: CustomerEntityProps): Promise<DomainCustomerEntity> {
    const dbProps = this.mapToDbProps(props);
    const dbEntity = await this.typeOrmRepository.save(
      this.typeOrmRepository.create(dbProps),
    );

    return this.mapToDomainEntity(dbEntity);
  }

  private mapToDbProps(props: CustomerEntityProps): InputCustomerEntityProps {
    return {
      name: props.name.value,
      email: props.email.value,
      cpf: props.cpf.value,
    };
  }

  private mapToDomainEntity(
    entity: InfrastructureCustomerEntity,
  ): DomainCustomerEntity {
    return DomainCustomerEntity.create({
      id: EntityIdValueObject.create(entity.id),
      name: FullNameValueObject.createFromFullName(entity.name),
      email: EmailValueObject.create(entity.email),
      cpf: CpfValueObject.create(entity.cpf),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
