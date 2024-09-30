import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { DatabaseConfigService } from './database-config.service';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'test' ? false : true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
  ],
  providers: [AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class ConfigModule {}
