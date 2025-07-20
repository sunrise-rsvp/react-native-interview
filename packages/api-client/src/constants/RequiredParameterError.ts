import { ApiError } from './ApiError';

export class RequiredParameterError extends ApiError {
  constructor(e: unknown) {
    super(e, false);
    this.name = 'RequiredParameterError';
  }
}
