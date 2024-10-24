import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

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
        for (const error of errors) {
          validationErrors[error.property || '-'] = Object.values(
            error.constraints || { default: 'Invalid Data' },
          )[0];
        }

        return new BadRequestException({
          message: 'Validation Error',
          errors: validationErrors,
        });
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
