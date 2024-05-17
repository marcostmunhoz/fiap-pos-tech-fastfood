import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './shared/infrastructure/config/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { InvalidValueExceptionFilter } from './shared/infrastructure/filter/invalid-value-exception.filter';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalFilters(new InvalidValueExceptionFilter());

  app.setGlobalPrefix('api/v1');

  await app.listen(config.getPort(), config.getHost());
}
bootstrap();
