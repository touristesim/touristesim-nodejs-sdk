import { Resource } from './Resource';
import { Plan } from '../Models/Model';
import { Collection, PaginatedCollection } from '../Support/Collection';

/**
 * Plans Resource
 */
export class Plans extends Resource {
  async get(filters: Record<string, any> = {}): Promise<PaginatedCollection> {
    const response = await this.client.get('/plans', filters);
    return new PaginatedCollection(
      Collection.make(response.data?.plans || [], Plan).all(),
      response.data?.pagination || {}
    );
  }

  async find(id: number | string): Promise<Plan> {
    const response = await this.client.get(`/plans/${id}`);
    return new Plan(response.data);
  }

  async validate(planId: number, quantity: number): Promise<Record<string, any>> {
    const response = await this.client.post('/plans/validate', {
      plan_id: planId,
      quantity,
    });
    return response.data || {};
  }

  async byCountry(code: string, perPage: number = 50): Promise<Collection<Plan>> {
    const response = await this.client.get('/plans', { country: code, per_page: perPage });
    return Collection.make(response.data?.plans || [], Plan);
  }

  async byRegion(slug: string, perPage: number = 50): Promise<Collection<Plan>> {
    const response = await this.client.get('/plans', { region: slug, per_page: perPage });
    return Collection.make(response.data?.plans || [], Plan);
  }

  async global(perPage: number = 50): Promise<Collection<Plan>> {
    const response = await this.client.get('/plans', { type: 'global', per_page: perPage });
    return Collection.make(response.data?.plans || [], Plan);
  }
}
