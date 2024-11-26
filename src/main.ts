import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utility/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: function (errors: ValidationError[]) {
        const validationErrors = {};
        let firstError = '';
        for (const error of errors) {
          const filedError = Object.values(
            error.constraints || { default: 'Invalid Data' },
          )[0];
          firstError = firstError ? firstError : filedError;
          validationErrors[error.property || '-'] = filedError;
        }

        return new BadRequestException({
          message: firstError,
          error: 'Validation Error',
          errors: validationErrors,
        });
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
