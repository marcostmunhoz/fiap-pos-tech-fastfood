import { CustomerEntity as DomainCustomerEntity } from '@/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@/customer/domain/repository/customer.repository.interface';
import { CpfValueObject } from '@/customer/domain/value-object/cpf.value-object';
import { EmailValueObject } from '@/customer/domain/value-object/email.value-object';
import { FullNameValueObject } from '@/customer/domain/value-object/full-name.value-object';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity as InfrastructureCustomerEntity } from '../entity/customer.entity';

export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(InfrastructureCustomerEntity)
    private readonly typeOrmRepository: Repository<InfrastructureCustomerEntity>,
  ) {}

  async findByCpf(cpf: CpfValueObject): Promise<DomainCustomerEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({ cpf: cpf.value });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async save(entity: DomainCustomerEntity): Promise<DomainCustomerEntity> {
    const dbEntity = await this.typeOrmRepository.save(
      this.mapToDbEntity(entity),
    );

    return this.mapToDomainEntity(dbEntity);
  }

  async existsWithCpf(cpf: CpfValueObject): Promise<boolean> {
    return await this.typeOrmRepository.existsBy({ cpf: cpf.value });
  }

  private mapToDomainEntity(
    entity: InfrastructureCustomerEntity,
  ): DomainCustomerEntity {
    return new DomainCustomerEntity({
      id: EntityIdValueObject.create(entity.id),
      name: entity.name
        ? FullNameValueObject.createFromFullName(entity.name)
        : null,
      email: entity.email ? EmailValueObject.create(entity.email) : null,
      cpf: entity.cpf ? CpfValueObject.create(entity.cpf) : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToDbEntity(
    props: DomainCustomerEntity,
  ): InfrastructureCustomerEntity {
    return {
      id: props.id.value,
      name: props.name?.value,
      email: props.email?.value,
      cpf: props.cpf?.value,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
