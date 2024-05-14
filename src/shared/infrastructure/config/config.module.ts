import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { DatabaseConfigService } from './database-config.service';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';

@Module({
  imports: [BaseConfigModule.forRoot()],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class ConfigModule {}
