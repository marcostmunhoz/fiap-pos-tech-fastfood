import { ProductEntity as DomainProductEntity } from '@/shared/domain/entity/product.entity';
import { ProductCategoryEnum } from '@/shared/domain/enum/product-category.enum';
import {
  ProductRepository,
  SearchProductQuery,
} from '@/shared/domain/repository/product.repository.interface';
import { EntityIdValueObject } from '@/shared/domain/value-object/entity-id.value-object';
import { MoneyValueObject } from '@/shared/domain/value-object/money.value-object';
import { ProductCodeValueObject } from '@/shared/domain/value-object/product-code.value-object';
import { ProductDescriptionValueObject } from '@/shared/domain/value-object/product-description.value-object';
import { ProductNameValueObject } from '@/shared/domain/value-object/product-name.value-object';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Not, Repository } from 'typeorm';
import { ProductEntity as InfrastructureProductEntity } from '../entity/product.entity';

export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(InfrastructureProductEntity)
    private readonly typeOrmRepository: Repository<InfrastructureProductEntity>,
  ) {}

  async list(): Promise<DomainProductEntity[]> {
    const dbEntities = await this.typeOrmRepository.find();

    return dbEntities.map((dbEntity) => this.mapToDomainEntity(dbEntity));
  }

  async search(filter: SearchProductQuery): Promise<DomainProductEntity[]> {
    const dbQuery = await this.typeOrmRepository.createQueryBuilder('products');

    if (filter.query) {
      dbQuery.where(
        new Brackets((qb) => {
          qb.where('products.code LIKE :code', { code: `%${filter.query}%` });
          qb.orWhere('products.name LIKE :name', { name: `%${filter.query}%` });
        }),
      );
    }

    if (filter.category) {
      dbQuery.andWhere('products.category = :c', { c: filter.category });
    }

    const dbEntities = await dbQuery.getMany();

    return dbEntities.map((dbEntity) => this.mapToDomainEntity(dbEntity));
  }

  async findById(id: EntityIdValueObject): Promise<DomainProductEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({ id: id.value });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async findByCode(code: ProductCodeValueObject): Promise<DomainProductEntity> {
    const dbEntity = await this.typeOrmRepository.findOneBy({
      code: code.value,
    });

    if (!dbEntity) {
      return null;
    }

    return this.mapToDomainEntity(dbEntity);
  }

  async save(entity: DomainProductEntity): Promise<DomainProductEntity> {
    const dbEntity = await this.typeOrmRepository.save(
      this.mapToDbEntity(entity),
    );

    return this.mapToDomainEntity(dbEntity);
  }

  async delete(id: EntityIdValueObject): Promise<void> {
    await this.typeOrmRepository.delete({ id: id.value });
  }

  existsWithCode(
    code: ProductCodeValueObject,
    except?: EntityIdValueObject,
  ): Promise<boolean> {
    const where: FindOptionsWhere<InfrastructureProductEntity> = {
      code: code.value,
    };

    if (except) {
      where.id = Not(except.value);
    }

    return this.typeOrmRepository.exists({ where });
  }

  existsWithId(id: EntityIdValueObject): Promise<boolean> {
    return this.typeOrmRepository.existsBy({ id: id.value });
  }

  private mapToDomainEntity(
    entity: InfrastructureProductEntity,
  ): DomainProductEntity {
    return new DomainProductEntity({
      id: EntityIdValueObject.create(entity.id),
      code: ProductCodeValueObject.create(entity.code),
      name: ProductNameValueObject.create(entity.name),
      description: ProductDescriptionValueObject.create(entity.description),
      price: MoneyValueObject.create(entity.price),
      category: entity.category as ProductCategoryEnum,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private mapToDbEntity(
    entity: DomainProductEntity,
  ): InfrastructureProductEntity {
    return {
      id: entity.id.value,
      code: entity.code.value,
      name: entity.name.value,
      description: entity.description.value,
      price: entity.price.value,
      category: entity.category,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
