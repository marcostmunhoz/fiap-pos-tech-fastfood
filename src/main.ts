import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { applyGlobalAppConfig } from './main.config';
import { AppConfigService } from './shared/infrastructure/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfigService);

  applyGlobalAppConfig(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fastfood Totem API')
    .setDescription('API for Fastfood Totem')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs.json',
  });

  await app.listen(config.getPort(), config.getHost());
}
bootstrap();
