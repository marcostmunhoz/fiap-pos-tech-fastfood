import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { DatabaseConfigService } from './database-config.service';

@Module({
  imports: [BaseConfigModule.forRoot()],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class ConfigModule {}
