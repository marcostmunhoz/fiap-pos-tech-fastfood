import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  decode<T>(token: string): T {
    return this.jwtService.decode<T>(token);
  }
}
