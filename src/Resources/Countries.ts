import { Resource } from './Resource.js';
import { Country } from '../Models/Model.js';
import { Collection } from '../Support/Collection.js';

/**
 * Countries Resource
 */
export class Countries extends Resource {
  async all(filters: Record<string, any> = {}): Promise<Collection<Country>> {
    const response = await this.client.get('/countries', filters);
    return Collection.make(response.data?.countries || [], Country);
  }

  async find(code: string): Promise<Country | null> {
    try {
      const response = await this.client.get(`/countries/${code}`);
      return new Country(response.data);
    } catch {
      return null;
    }
  }

  async search(query: string): Promise<Collection<Country>> {
    const response = await this.client.get('/countries', { search: query });
    return Collection.make(response.data?.countries || [], Country);
  }

  async byRegion(slug: string): Promise<Collection<Country>> {
    const response = await this.client.get('/countries', { region: slug });
    return Collection.make(response.data?.countries || [], Country);
  }

  async featured(): Promise<Collection<Country>> {
    const response = await this.client.get('/countries', { featured: true });
    return Collection.make(response.data?.countries || [], Country);
  }
}
