import axios, { AxiosInstance, AxiosError } from 'axios';
import { Config } from './Config.js';
import { OAuthClient } from './Auth/OAuthClient.js';
import {
  ApiException,
  AuthenticationException,
  ValidationException,
  RateLimitException,
  ResourceNotFoundException,
  ServerException,
  ConnectionException,
} from './Exceptions/ApiException.js';

/**
 * HTTP Client with OAuth, retry logic, and error handling
 */
export class HttpClient {
  private config: Config;
  private oauth: OAuthClient;
  private client: AxiosInstance;
  private maxRetries: number = 3;
  private retryDelayMs: number = 100;

  constructor(config: Config, oauth: OAuthClient) {
    this.config = config;
    this.oauth = oauth;
    this.client = axios.create(config.getHttpClientOptions());
  }

  setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }

  async get(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    return this.request('GET', endpoint, { params });
  }

  async post(endpoint: string, data: Record<string, any> = {}): Promise<any> {
    return this.request('POST', endpoint, { data });
  }

  async put(endpoint: string, data: Record<string, any> = {}): Promise<any> {
    return this.request('PUT', endpoint, { data });
  }

  async delete(endpoint: string, data: Record<string, any> = {}): Promise<any> {
    return this.request('DELETE', endpoint, { data });
  }

  private async request(method: string, endpoint: string, options: any = {}): Promise<any> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const token = await this.oauth.getToken();

        const requestConfig = {
          method,
          url: endpoint,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          ...options,
        };

        const response = await this.client(requestConfig);
        return response.data;
      } catch (error: any) {
        lastError = error;

        // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
        if (error.response?.status) {
          const status = error.response.status;

          if (status === 401) {
            throw this.mapException(error);
          }

          if (status === 422) {
            throw this.mapException(error);
          }

          if (status === 429) {
            if (attempt < this.maxRetries) {
              const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
              await this.delay(retryAfter * 1000);
              continue;
            }
            throw this.mapException(error);
          }

          if (status >= 400 && status < 500) {
            throw this.mapException(error);
          }

          // Retry on 5xx errors
          if (status >= 500) {
            if (attempt < this.maxRetries) {
              await this.delay(this.retryDelayMs * (attempt + 1));
              continue;
            }
            throw this.mapException(error);
          }
        }

        // Retry on connection errors
        if (attempt < this.maxRetries && this.isRetryableError(error)) {
          await this.delay(this.retryDelayMs * (attempt + 1));
          continue;
        }

        throw this.mapException(error);
      }
    }

    throw this.mapException(lastError);
  }

  private isRetryableError(error: any): boolean {
    if (!error) return false;
    if (error.code === 'ECONNREFUSED') return true;
    if (error.code === 'ECONNRESET') return true;
    if (error.code === 'ETIMEDOUT') return true;
    if (error.code === 'EHOSTUNREACH') return true;
    if (error.message?.includes('timeout')) return true;
    return false;
  }

  private mapException(error: any): ApiException {
    if (!error.response) {
      // Network error
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return ConnectionException.timeout(error.message);
      }
      return ConnectionException.connectionFailed(error.message);
    }

    const status = error.response.status;
    const data = error.response.data || {};

    switch (status) {
      case 401:
        return new AuthenticationException(data.message || 'Unauthorized', status);

      case 422:
        const validationError = new ValidationException(
          data.message || 'Validation failed',
          status,
          data.errors || {}
        );
        return validationError;

      case 429:
        const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
        return new RateLimitException(data.message || 'Rate limit exceeded', retryAfter);

      case 404:
        return new ResourceNotFoundException(data.message || 'Resource not found', status);

      case 503:
        return ServerException.maintenance(data.message || 'Service unavailable');

      default:
        if (status >= 500) {
          return new ServerException(data.message || 'Server error', status);
        }
        return new ApiException(data.message || error.message, status, data);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
