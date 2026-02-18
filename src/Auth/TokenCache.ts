import NodeCache from 'node-cache';
import { Token } from './Token.js';

/**
 * In-memory token cache with optional persistence
 */
export class TokenCache {
  private cache: NodeCache;
  private ttl: number = 3600; // 1 hour

  constructor(ttl: number = 3600) {
    this.ttl = ttl;
    // Create cache with automatic cleanup of expired items
    this.cache = new NodeCache({ stdTTL: this.ttl, checkperiod: 120 });
  }

  get(key: string): Token | null {
    const cached = this.cache.get(key);
    if (cached && typeof cached === 'object' && 'access_token' in cached) {
      return Token.fromJSON(cached);
    }
    return null;
  }

  store(key: string, token: Token): void {
    this.cache.set(key, token.toJSON(), this.ttl);
  }

  forget(key: string): void {
    this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.flushAll();
  }
}
