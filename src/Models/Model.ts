/**
 * Base Model class with type casting support
 */
export class Model {
  protected attributes: Record<string, any> = {};
  protected casts: Record<string, string> = {};

  constructor(attributes: Record<string, any> = {}) {
    this.fill(attributes);
  }

  fill(attributes: Record<string, any>): this {
    for (const key in attributes) {
      this.setAttribute(key, attributes[key]);
    }
    return this;
  }

  setAttribute(key: string, value: any): void {
    if (this.casts[key]) {
      this.attributes[key] = this.cast(value, this.casts[key]);
    } else {
      this.attributes[key] = value;
    }
  }

  getAttribute(key: string): any {
    return this.attributes[key];
  }

  private cast(value: any, type: string): any {
    if (value === null || value === undefined) return value;

    switch (type) {
      case 'int':
      case 'integer':
        return parseInt(value, 10);
      case 'float':
      case 'double':
        return parseFloat(value);
      case 'bool':
      case 'boolean':
        return value === true || value === 'true' || value === 1 || value === '1';
      case 'string':
        return String(value);
      case 'array':
        return Array.isArray(value) ? value : [];
      case 'object':
        return typeof value === 'object' ? value : {};
      default:
        return value;
    }
  }

  [key: string]: any;

  get(key: string, defaultValue: any = null): any {
    return this.attributes[key] ?? defaultValue;
  }

  toJSON(): Record<string, any> {
    return this.attributes;
  }

  toObject(): Record<string, any> {
    return { ...this.attributes };
  }
}

/**
 * Plan Model
 */
export class Plan extends Model {
  protected casts: Record<string, string> = {
    id: 'integer',
    price: 'float',
    data: 'integer',
    validity_days: 'integer',
    reloadable: 'boolean',
    countries_count: 'integer',
  };

  getType(): string {
    return this.get('type', 'local');
  }

  isLocal(): boolean {
    return this.getType() === 'local';
  }

  isRegional(): boolean {
    return this.getType() === 'regional';
  }

  isGlobal(): boolean {
    return this.getType() === 'global';
  }

  getPrice(): number {
    return this.get('price', 0);
  }

  getValidityDays(): number {
    return this.get('validity_days', 0);
  }

  isReloadable(): boolean {
    return this.get('reloadable', false);
  }

  getDataGB(): number {
    return Math.floor(this.get('data', 0) / 1024);
  }

  isUnlimited(): boolean {
    return this.get('data', 0) === 0;
  }

  getCountries(): string[] {
    return this.get('countries', []);
  }

  getCountriesCount(): number {
    return this.get('countries_count', 0);
  }

  getRegion(): string | null {
    return this.get('region', null);
  }
}

/**
 * Country Model
 */
export class Country extends Model {
  protected casts: Record<string, string> = {
    plans_count: 'integer',
    is_featured: 'boolean',
  };

  getCode(): string {
    return this.get('code', '');
  }

  getName(): string {
    return this.get('name', '');
  }

  getPlansCount(): number {
    return this.get('plans_count', 0);
  }

  isFeatured(): boolean {
    return this.get('is_featured', false);
  }

  getFlagUrl(): string {
    return this.get('flag', '');
  }
}

/**
 * Order Model
 */
export class Order extends Model {
  protected casts: Record<string, string> = {
    id: 'integer',
    plan_id: 'integer',
    quantity: 'integer',
    total_price: 'float',
  };

  getStatus(): string {
    return this.get('status', 'pending');
  }

  isCompleted(): boolean {
    return this.getStatus() === 'completed';
  }

  isPending(): boolean {
    return this.getStatus() === 'pending';
  }

  isFailed(): boolean {
    return this.getStatus() === 'failed';
  }

  isCancelled(): boolean {
    return this.getStatus() === 'cancelled';
  }

  getTotalPrice(): number {
    return this.get('total_price', 0);
  }

  getQuantity(): number {
    return this.get('quantity', 0);
  }
}

/**
 * eSIM Model
 */
export class Esim extends Model {
  protected casts: Record<string, string> = {
    balance_data: 'integer',
  };

  getStatus(): string {
    return this.get('status', 'pending');
  }

  isActive(): boolean {
    return this.getStatus() === 'active';
  }

  isPending(): boolean {
    return this.getStatus() === 'pending';
  }

  isExpired(): boolean {
    return this.getStatus() === 'expired';
  }

  isSuspended(): boolean {
    return this.getStatus() === 'suspended';
  }

  getIccid(): string {
    return this.get('iccid', '');
  }

  getBalanceData(): number {
    return this.get('balance_data', 0);
  }

  getValidityEnd(): string | null {
    return this.get('validity_end', null);
  }
}
