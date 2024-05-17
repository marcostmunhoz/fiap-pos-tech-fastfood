import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from './shared/infrastructure/config/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { InvalidValueExceptionFilter } from './shared/infrastructure/filter/invalid-value-exception.filter';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fastfood Totem API')
    .setDescription('API for Fastfood Totem')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.getPort(), config.getHost());
}
bootstrap();
