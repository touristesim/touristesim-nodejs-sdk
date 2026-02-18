import { HttpClient } from '../HttpClient.js';

/**
 * Base Resource class
 */
export class Resource {
  protected client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }
}
