import { ZodError } from 'zod';

export class ValidationException extends Error {
  statusCode: number;
  errors: ZodError | string;

  constructor(errors: ZodError | string) {
    super('Bad request');
    this.statusCode = 400;
    this.errors = errors;
  }
}
