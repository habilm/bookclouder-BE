import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationPipe = new ValidationPipe({
  whitelist: true,
  // transform: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  stopAtFirstError: true,
  validationError: {
    target: false,
    value: false,
  },
  exceptionFactory,
});

export function exceptionFactory(errors: ValidationError[], message?: string) {
  const validationErrors = {};
  let firstError = message;
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
}
