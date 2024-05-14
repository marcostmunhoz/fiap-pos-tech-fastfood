import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  getType(): DatabaseType {
    return 'mysql';
  }

  getHost(): string {
    return this.configService.get<string>('MYSQL_DATABASE_HOST');
  }

  getPort(): number {
    return parseInt(this.configService.get('MYSQL_DATABASE_PORT'), 10) || 3306;
  }

  getUsername(): string {
    return this.configService.get<string>('MYSQL_DATABASE_USERNAME');
  }

  getPassword(): string {
    return this.configService.get<string>('MYSQL_DATABASE_PASSWORD');
  }

  getDatabase(): string {
    return this.configService.get<string>('MYSQL_DATABASE_NAME');
  }

  getLogging(): boolean {
    return this.configService.get<string>('MYSQL_DATABASE_LOGGING') === 'true';
  }

  getEntities(): string[] {
    return [];
  }

  getSynchronize(): boolean {
    return false;
  }
}
