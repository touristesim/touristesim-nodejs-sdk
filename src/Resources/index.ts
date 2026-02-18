import { Resource } from './Resource';

/**
 * Regions Resource
 */
export class Regions extends Resource {
  async all(): Promise<any[]> {
    const response = await this.client.get('/regions');
    return response.data?.regions || [];
  }
}

/**
 * Orders Resource
 */
import { Order } from '../Models/Model';
import { Collection, PaginatedCollection } from '../Support/Collection';

export class Orders extends Resource {
  async all(filters: Record<string, any> = {}): Promise<PaginatedCollection<Order>> {
    const response = await this.client.get('/orders', filters);
    return new PaginatedCollection(
      Collection.make(response.data?.orders || [], Order).all(),
      response.data?.pagination || {}
    );
  }

  async find(id: number | string): Promise<Order> {
    const response = await this.client.get(`/orders/${id}`);
    return new Order(response.data);
  }

  async create(data: Record<string, any>): Promise<Order> {
    const response = await this.client.post('/orders', data);
    return new Order(response.data);
  }

  async cancel(id: number | string): Promise<boolean> {
    await this.client.post(`/orders/${id}/cancel`, {});
    return true;
  }
}

/**
 * Esims Resource
 */
import { Esim } from '../Models/Model';

export class Esims extends Resource {
  async all(filters: Record<string, any> = {}): Promise<PaginatedCollection<Esim>> {
    const response = await this.client.get('/esims', filters);
    return new PaginatedCollection(
      Collection.make(response.data?.esims || [], Esim).all(),
      response.data?.pagination || {}
    );
  }

  async find(iccid: string): Promise<Esim> {
    const response = await this.client.get(`/esims/${iccid}`);
    return new Esim(response.data);
  }

  async usage(iccid: string): Promise<Record<string, any>> {
    const response = await this.client.get(`/esims/${iccid}/usage`);
    return response.data || {};
  }

  async topupPackages(iccid: string): Promise<Collection> {
    const response = await this.client.get(`/esims/${iccid}/topups`);
    return Collection.make(response.data?.packages || []);
  }

  async topup(iccid: string, packageId: number): Promise<Record<string, any>> {
    const response = await this.client.post(`/esims/${iccid}/topup`, { package_id: packageId });
    return response.data || {};
  }

  async instructions(iccid: string): Promise<string> {
    const response = await this.client.get(`/esims/${iccid}/instructions`);
    return response.data?.instructions || '';
  }

  async sendEmail(iccid: string, email: string): Promise<boolean> {
    await this.client.post(`/esims/${iccid}/send-email`, { email });
    return true;
  }
}

/**
 * Balance Resource
 */
export class Balance extends Resource {
  async get(): Promise<Record<string, any>> {
    const response = await this.client.get('/balance');
    return response.data || {};
  }

  async history(filters: Record<string, any> = {}): Promise<PaginatedCollection> {
    const response = await this.client.get('/balance/history', filters);
    return new PaginatedCollection(
      response.data?.history || [],
      response.data?.pagination || {}
    );
  }
}

/**
 * Webhooks Resource
 */
export class Webhooks extends Resource {
  async all(filters: Record<string, any> = {}): Promise<Collection> {
    const response = await this.client.get('/webhooks', filters);
    return Collection.make(response.data?.webhooks || []);
  }

  async find(id: number | string): Promise<Record<string, any>> {
    const response = await this.client.get(`/webhooks/${id}`);
    return response.data || {};
  }

  async create(data: Record<string, any>): Promise<Record<string, any>> {
    const response = await this.client.post('/webhooks', data);
    return response.data || {};
  }

  async update(id: number | string, data: Record<string, any>): Promise<Record<string, any>> {
    const response = await this.client.put(`/webhooks/${id}`, data);
    return response.data || {};
  }

  async delete(id: number | string): Promise<boolean> {
    await this.client.delete(`/webhooks/${id}`, {});
    return true;
  }

  async test(id: number | string): Promise<Record<string, any>> {
    const response = await this.client.post(`/webhooks/${id}/test`, {});
    return response.data || {};
  }
}
