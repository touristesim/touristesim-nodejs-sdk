/**
 * Base API Exception class
 */
export class ApiException extends Error {
  public statusCode: number;
  public response: any;
  public requestId?: string;

  constructor(message: string, statusCode: number = 0, response: any = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.response = response;
    Error.captureStackTrace(this, this.constructor);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getResponse(): any {
    return this.response;
  }

  getRequestId(): string | undefined {
    return this.requestId;
  }
}

/**
 * Authentication Exception - 401 Unauthorized
 */
export class AuthenticationException extends ApiException {
  static invalidCredentials(message: string = 'Invalid client credentials'): AuthenticationException {
    return new AuthenticationException(message, 401);
  }

  static tokenExpired(message: string = 'Token has expired'): AuthenticationException {
    return new AuthenticationException(message, 401);
  }

  static unauthorized(message: string = 'Unauthorized'): AuthenticationException {
    return new AuthenticationException(message, 401);
  }
}

/**
 * Validation Exception - 422 Unprocessable Entity
 */
export class ValidationException extends ApiException {
  private errors: Record<string, string> = {};

  constructor(message: string = 'Validation failed', statusCode: number = 422, errors?: Record<string, string>) {
    super(message, statusCode);
    if (errors) {
      this.errors = errors;
    }
  }

  getErrors(): Record<string, string> {
    return this.errors;
  }

  setErrors(errors: Record<string, string>): void {
    this.errors = errors;
  }
}

/**
 * Rate Limit Exception - 429 Too Many Requests
 */
export class RateLimitException extends ApiException {
  private retryAfter: number = 60;

  constructor(message: string = 'Rate limit exceeded', retryAfter: number = 60) {
    super(message, 429);
    this.retryAfter = retryAfter;
  }

  getRetryAfter(): number {
    return this.retryAfter;
  }

  setRetryAfter(retryAfter: number): void {
    this.retryAfter = retryAfter;
  }
}

/**
 * Resource Not Found Exception - 404 Not Found
 */
export class ResourceNotFoundException extends ApiException {
  static plan(id: number | string): ResourceNotFoundException {
    return new ResourceNotFoundException(`Plan with ID ${id} not found`, 404);
  }

  static order(id: number | string): ResourceNotFoundException {
    return new ResourceNotFoundException(`Order with ID ${id} not found`, 404);
  }

  static esim(iccid: string): ResourceNotFoundException {
    return new ResourceNotFoundException(`eSIM with ICCID ${iccid} not found`, 404);
  }

  constructor(message: string = 'Resource not found', statusCode: number = 404) {
    super(message, statusCode);
  }
}

/**
 * Server Exception - 5xx Server Errors
 */
export class ServerException extends ApiException {
  static maintenance(message: string = 'Server is under maintenance'): ServerException {
    return new ServerException(message, 503);
  }

  constructor(message: string = 'Server error', statusCode: number = 500) {
    super(message, statusCode);
  }
}

/**
 * Connection Exception - Network/Timeout Errors
 */
export class ConnectionException extends ApiException {
  static timeout(message: string = 'Request timeout'): ConnectionException {
    return new ConnectionException(message);
  }

  static connectionFailed(message: string = 'Connection failed'): ConnectionException {
    return new ConnectionException(message);
  }

  constructor(message: string = 'Connection error', statusCode: number = 0) {
    super(message, statusCode);
  }
}
