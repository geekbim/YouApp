import { NestFactory } from '@nestjs/core';
import { ConfigService } from "@nestjs/config";
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const limitRequestSize: string = config.get('LIMIT_REQUEST_SIZE');
  const options = new DocumentBuilder()
    .setTitle('YouApp Docs')
    .setDescription('The YouApp API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addSecurityRequirements('JWT-auth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
          persistAuthorization: true, // this
      },
  });

  
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.json({ limit: limitRequestSize }));
  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${port}`)
  });
}
bootstrap();
