import { ConfigModule } from '@/shared/infrastructure/config/config.module';
import { DatabaseConfigService } from '@/shared/infrastructure/config/database-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { CustomerModule } from './customer/customer.module';
import { KitchenModule } from './kitchen/kitchen.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: DatabaseConfigService): DataSourceOptions => ({
        type: config.getType() as any,
        host: config.getHost(),
        port: config.getPort(),
        username: config.getUsername(),
        password: config.getPassword(),
        database: config.getDatabase(),
        logging: config.getLogging(),
        entities: [__dirname + '/**/infrastructure/entity/*.entity{.ts,.js}'],
        synchronize: config.getSynchronize(),
      }),
      inject: [DatabaseConfigService],
    }),
    ConfigModule,
    CustomerModule,
    SharedModule,
    KitchenModule,
    OrderModule,
    PaymentModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
