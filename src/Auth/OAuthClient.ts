import axios, { AxiosInstance } from 'axios';
import { Config } from '../Config';
import { AuthenticationException } from '../Exceptions/ApiException';
import { Token } from './Token';
import { TokenCache } from './TokenCache';

/**
 * OAuth 2.0 Client for handling authentication
 */
export class OAuthClient {
  private config: Config;
  private token: Token | null = null;
  private tokenCache: TokenCache;
  private httpClient: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    this.tokenCache = new TokenCache();
    this.httpClient = axios.create({
      timeout: config.getTimeout(),
      headers: {
        'User-Agent': config.getUserAgent(),
      },
    });
  }

  async getToken(): Promise<string> {
    const validToken = await this.getValidToken();
    return validToken.getAccessToken();
  }

  async getValidToken(): Promise<Token> {
    // Check if we have a cached token that's still valid
    if (this.token && !this.token.isExpired()) {
      return this.token;
    }

    // Try to get from file cache
    const cachedToken = this.tokenCache.get('oauth_token');
    if (cachedToken && !cachedToken.isExpired()) {
      this.token = cachedToken;
      return this.token;
    }

    // Request new token
    this.token = await this.requestToken();
    this.tokenCache.store('oauth_token', this.token);
    return this.token;
  }

  async requestToken(): Promise<Token> {
    try {
      const response = await this.httpClient.post(
        this.config.getOAuthTokenUrl(),
        {
          grant_type: 'client_credentials',
          client_id: this.config.getClientId(),
          client_secret: this.config.getClientSecret(),
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return new Token(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw AuthenticationException.invalidCredentials('Invalid client credentials');
      }
      throw error;
    }
  }

  async revokeToken(): Promise<boolean> {
    this.token = null;
    this.tokenCache.forget('oauth_token');
    return true;
  }
}
