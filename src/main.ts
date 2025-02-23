import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Remove properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion of types
      },
    })
  );

  app.enableCors();
  const port = app.get(ConfigService).get<number>('PORT') || 8080;
  console.log(`Using port: ${port}`);
  await app.listen(port);
}
bootstrap();
