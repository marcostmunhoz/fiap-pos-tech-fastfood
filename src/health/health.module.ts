import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { LoadController } from './load.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, LoadController],
})
export class HealthModule {}
