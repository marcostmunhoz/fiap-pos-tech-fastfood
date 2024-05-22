import { Module } from '@nestjs/common';
import {
  EntityIdGeneratorHelperToken,
  OrderRepositoryToken,
  ProductRepositoryToken,
} from './tokens';
import { UuidV4EntityIdGeneratorHelper } from './infrastructure/helper/uuid-v4-entity-id-generator.helper';
import { TypeOrmProductRepository } from './infrastructure/repository/type-orm-product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/entity/product.entity';
import { OrderEntity } from './infrastructure/entity/order.entity';
import { TypeOrmOrderRepository } from './infrastructure/repository/type-orm-order.repository';
import { OrderFactory } from './domain/factory/order.factory';

const factories = [OrderFactory];

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
  ],
})
export class SharedModule {}
