/**
 * Configuration class for TouristeSIM Node.js SDK
 */
export interface ConfigOptions {
  baseUrl?: string;
  mode?: 'sandbox' | 'production';
  timeout?: number;
  connectTimeout?: number;
  verifySsl?: boolean;
  userAgent?: string;
  maxRetries?: number;
}

export class Config {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string = 'https://api.touristesim.net/v1';
  private mode: 'sandbox' | 'production' = 'sandbox';
  private timeout: number = 30000;
  private connectTimeout: number = 10000;
  private verifySsl: boolean = true;
  private userAgent: string;
  private maxRetries: number = 3;

  constructor(clientId: string, clientSecret: string, options: ConfigOptions = {}) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    if (options.baseUrl) {
      this.baseUrl = options.baseUrl.replace(/\/$/, '');
    }
    if (options.mode && ['sandbox', 'production'].includes(options.mode)) {
      this.mode = options.mode;
    }
    if (options.timeout) {
      this.timeout = options.timeout;
    }
    if (options.connectTimeout) {
      this.connectTimeout = options.connectTimeout;
    }
    if (typeof options.verifySsl === 'boolean') {
      this.verifySsl = options.verifySsl;
    }
    if (options.userAgent) {
      this.userAgent = options.userAgent;
    } else {
      this.userAgent = this.getDefaultUserAgent();
    }
    if (options.maxRetries) {
      this.maxRetries = options.maxRetries;
    }
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientSecret(): string {
    return this.clientSecret;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getMode(): string {
    return this.mode;
  }

  isSandbox(): boolean {
    return this.mode === 'sandbox';
  }

  isProduction(): boolean {
    return this.mode === 'production';
  }

  shouldVerifySsl(): boolean {
    return this.verifySsl;
  }

  getTimeout(): number {
    return this.timeout;
  }

  getConnectTimeout(): number {
    return this.connectTimeout;
  }

  getUserAgent(): string {
    return this.userAgent;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }

  getOAuthTokenUrl(): string {
    return this.baseUrl + '/../oauth/token';
  }

  private getDefaultUserAgent(): string {
    const nodeVersion = process.version;
    return `TouristeSIM-SDK/1.0.0 (Node/${nodeVersion})`;
  }

  getHttpClientOptions(): Record<string, any> {
    return {
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'User-Agent': this.getUserAgent(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      httpsAgent: this.verifySsl ? undefined : { rejectUnauthorized: false },
    };
  }
}
