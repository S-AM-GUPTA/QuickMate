import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const port = process.env.BACKEND_PORT || process.env.PORT || 3005;
  // If port 3000 is accidentally provided (Next.js default), force 3005
  await app.listen(String(port) === '3000' ? 3005 : port);
}
bootstrap();
// Trigger reload 2
