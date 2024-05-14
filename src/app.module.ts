import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@/shared/infrastructure/config/config.module';
import { DatabaseConfigService } from '@/shared/infrastructure/config/database-config.service';

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
        entities: config.getEntities(),
        synchronize: config.getSynchronize(),
      }),
      inject: [DatabaseConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
