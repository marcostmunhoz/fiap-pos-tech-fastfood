import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderFactory } from './domain/factory/order.factory';
import { ProductFactory } from './domain/factory/product.factory';
import { OrderEntity } from './infrastructure/entity/order.entity';
import { ProductEntity } from './infrastructure/entity/product.entity';
import { UuidV4EntityIdGeneratorHelper } from './infrastructure/helper/uuid-v4-entity-id-generator.helper';
import { TypeOrmOrderRepository } from './infrastructure/repository/type-orm-order.repository';
import { TypeOrmProductRepository } from './infrastructure/repository/type-orm-product.repository';
import {
  EntityIdGeneratorHelperToken,
  OrderRepositoryToken,
  ProductRepositoryToken,
} from './tokens';

const factories = [OrderFactory, ProductFactory];

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, OrderEntity])],
  providers: [
    {
      provide: EntityIdGeneratorHelperToken,
      useClass: UuidV4EntityIdGeneratorHelper,
    },
    {
      provide: ProductRepositoryToken,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: OrderRepositoryToken,
      useClass: TypeOrmOrderRepository,
    },
    ...factories,
  ],
  exports: [
    EntityIdGeneratorHelperToken,
    ProductRepositoryToken,
    OrderRepositoryToken,
    OrderFactory,
    ProductFactory,
  ],
})
export class SharedModule {}
