export class ApiError extends Error {
  public retryable: boolean;

  constructor(e: unknown, retryable: boolean) {
    const retryableStatement = ` - this is ${retryable ? '' : 'not '}retryable`;
    let message = `Generic Api Error${retryableStatement}`;

    if (e instanceof Error) message = `${e.message}${retryableStatement}`;
    if (typeof e === 'string') message = e + retryableStatement;

    super(message);
    this.retryable = retryable;
    this.name = 'ApiError';
  }
}
