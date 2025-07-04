import { ZodError } from 'zod';

export class ValidationException extends Error {
  statusCode: number;
  errors: ZodError;

  constructor(errors: ZodError) {
    super('Bad request');
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class NotFoundException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
