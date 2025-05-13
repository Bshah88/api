import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { GenericErrorFilter } from './filters/generic-error.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const {
  //   doubleCsrfProtection,
  // } = doubleCsrf({
  //   getSecret: () => process.env.CSRF_SECRET,
  //   getSessionIdentifier: () => 'csrf',
  // });
  app.enableCors({
    origin: process.env.UI_URL,
    credentials: true,
  });
  app.use(helmet());
  // app.use(doubleCsrfProtection);
  // Global pipes and interceptors
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(
    new GenericErrorFilter(app.get(HttpAdapterHost)),
    new HttpExceptionFilter(),
  );
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
