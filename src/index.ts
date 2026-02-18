import { Config, ConfigOptions } from './Config.js';
import { OAuthClient } from './Auth/OAuthClient.js';
import { HttpClient } from './HttpClient.js';
import { Plans } from './Resources/Plans.js';
import { Countries } from './Resources/Countries.js';
import { Regions, Orders, Esims, Balance, Webhooks } from './Resources/index.js';

/**
 * Main Tourist eSIM SDK class
 */
export class TouristEsim {
  private config: Config;
  private oauth: OAuthClient;
  private httpClient: HttpClient;

  private plansResource?: Plans;
  private countriesResource?: Countries;
  private regionsResource?: Regions;
  private ordersResource?: Orders;
  private esimsResource?: Esims;
  private balanceResource?: Balance;
  private webhooksResource?: Webhooks;

  constructor(clientId: string, clientSecret: string, options: ConfigOptions = {}) {
    this.config = new Config(clientId, clientSecret, options);
    this.oauth = new OAuthClient(this.config);
    this.httpClient = new HttpClient(this.config, this.oauth);
  }

  plans(): Plans {
    if (!this.plansResource) {
      this.plansResource = new Plans(this.httpClient);
    }
    return this.plansResource;
  }

  countries(): Countries {
    if (!this.countriesResource) {
      this.countriesResource = new Countries(this.httpClient);
    }
    return this.countriesResource;
  }

  regions(): Regions {
    if (!this.regionsResource) {
      this.regionsResource = new Regions(this.httpClient);
    }
    return this.regionsResource;
  }

  orders(): Orders {
    if (!this.ordersResource) {
      this.ordersResource = new Orders(this.httpClient);
    }
    return this.ordersResource;
  }

  esims(): Esims {
    if (!this.esimsResource) {
      this.esimsResource = new Esims(this.httpClient);
    }
    return this.esimsResource;
  }

  balance(): Balance {
    if (!this.balanceResource) {
      this.balanceResource = new Balance(this.httpClient);
    }
    return this.balanceResource;
  }

  webhooks(): Webhooks {
    if (!this.webhooksResource) {
      this.webhooksResource = new Webhooks(this.httpClient);
    }
    return this.webhooksResource;
  }

  getConfig(): Config {
    return this.config;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  static VERSION(): string {
    return '1.0.0';
  }
}

// Export all classes and interfaces
export { Config, ConfigOptions } from './Config.js';
export { HttpClient } from './HttpClient.js';
export { OAuthClient } from './Auth/OAuthClient.js';
export { Token } from './Auth/Token.js';
export { TokenCache } from './Auth/TokenCache.js';
export {
  ApiException,
  AuthenticationException,
  ValidationException,
  RateLimitException,
  ResourceNotFoundException,
  ServerException,
  ConnectionException,
} from './Exceptions/ApiException.js';
export { Model, Plan, Country, Order, Esim } from './Models/Model.js';
export { Collection, PaginatedCollection, PaginationMeta } from './Support/Collection.js';
