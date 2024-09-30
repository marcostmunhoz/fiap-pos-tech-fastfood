import { UserEntity } from '@/shared/domain/entity/user.entity';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const mockUser: UserEntity = {
  id: 'mock-id',
  name: 'John Doe',
};

export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    request.user = mockUser;

    return true;
  }
}

export const createMockGuard = () => {
  return new MockGuard();
};

export const getAuthToken = (
  app: INestApplication,
  user: UserEntity = mockUser,
) => {
  return app.get(JwtService).sign({
    sub: user.id,
    name: user.name,
  });
};
