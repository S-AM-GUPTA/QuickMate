import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const portStr = process.env.BACKEND_PORT || process.env.PORT || '3005';
  let port = parseInt(portStr, 10);
  // If port 3000 is accidentally provided (Next.js default), force 3005
  if (port === 3000) {
    port = 3005;
  }
  
  // Explicitly bind to 0.0.0.0 to ensure Render load balancer can connect
  await app.listen(port, '0.0.0.0');
}
bootstrap();
// Trigger reload 2
