import { Module } from '@nestjs/common';
import { EntityIdGeneratorHelperToken, ProductRepositoryToken } from './tokens';
import { UuidV4EntityIdGeneratorHelper } from './infrastructure/helper/uuid-v4-entity-id-generator.helper';
import { TypeOrmProductRepository } from './infrastructure/repository/type-orm-product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: EntityIdGeneratorHelperToken,
      useClass: UuidV4EntityIdGeneratorHelper,
    },
    {
      provide: ProductRepositoryToken,
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: [EntityIdGeneratorHelperToken, ProductRepositoryToken],
})
export class SharedModule {}
