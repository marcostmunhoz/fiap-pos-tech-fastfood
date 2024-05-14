import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getHost(): string {
    return this.configService.get('HOST') || 'localhost';
  }

  getPort(): number {
    return parseInt(this.configService.get('PORT'), 10) || 3000;
  }
}
