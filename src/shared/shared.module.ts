import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderFactory } from './domain/factory/order.factory';
import { ProductFactory } from './domain/factory/product.factory';
import { AppConfigService } from './infrastructure/config/app-config.service';
import { ConfigModule } from './infrastructure/config/config.module';
import { OrderEntity } from './infrastructure/entity/order.entity';
import { ProductEntity } from './infrastructure/entity/product.entity';
import { AuthGuard } from './infrastructure/guard/auth.guard';
import { JwtHelper } from './infrastructure/helper/jwt.helper';
import { UuidV4EntityIdGeneratorHelper } from './infrastructure/helper/uuid-v4-entity-id-generator.helper';
import { TypeOrmOrderRepository } from './infrastructure/repository/type-orm-order.repository';
import { TypeOrmProductRepository } from './infrastructure/repository/type-orm-product.repository';
import {
  EntityIdGeneratorHelperToken,
  OrderRepositoryToken,
  ProductRepositoryToken,
} from './tokens';

const factories = [OrderFactory, ProductFactory];
const helpers = [JwtHelper];
const guards = [AuthGuard];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, OrderEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.getJwtSecret(),
      }),
      inject: [AppConfigService],
    }),
  ],
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
    ...helpers,
    ...guards,
  ],
  exports: [
    EntityIdGeneratorHelperToken,
    ProductRepositoryToken,
    OrderRepositoryToken,
    OrderFactory,
    ProductFactory,
    JwtHelper,
    AuthGuard,
  ],
})
export class SharedModule {}
