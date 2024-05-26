import { INestApplication, RequestMethod } from '@nestjs/common';
import { DomainExceptionFilter } from './shared/infrastructure/filter/domain-exception.filter';
import { TransformationPipe } from './shared/infrastructure/pipe/transformation.pipe';
import { ValidationPipe } from './shared/infrastructure/pipe/validation.pipe';

export const applyGlobalAppConfig = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe(), new TransformationPipe());

  app.useGlobalFilters(new DomainExceptionFilter());

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'api/docs', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });
};
