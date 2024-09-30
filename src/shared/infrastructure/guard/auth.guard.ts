import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtHelper } from '../helper/jwt.helper';

type TokenPayload = {
  sub: string;
  name: string | null;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      return false;
    }

    const token = authorization.split(' ')[1];
    const { sub, name } = this.jwtHelper.decode<TokenPayload>(token);

    request.user = {
      id: sub,
      name: name,
    };

    return true;
  }
}
