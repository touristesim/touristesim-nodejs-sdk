/**
 * Collection class for handling lists of items
 */
export class Collection<T = any> {
  protected items: T[] = [];

  constructor(items: T[] = []) {
    this.items = items;
  }

  static make<T = any>(items: T[], modelClass?: new (data: any) => T): Collection<T> {
    if (modelClass) {
      const instantiated = items.map((item: any) => {
        return item instanceof modelClass ? item : new modelClass(item);
      });
      return new Collection(instantiated);
    }
    return new Collection(items);
  }

  all(): T[] {
    return this.items;
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  first(): T | undefined {
    return this.items[0];
  }

  last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  filter(callback: (item: T, index: number) => boolean): Collection<T> {
    return new Collection(this.items.filter(callback));
  }

  map<U>(callback: (item: T, index: number) => U): Collection<U> {
    return new Collection(this.items.map(callback));
  }

  pluck(key: string): any[] {
    return this.items.map((item: any) => item[key]);
  }

  sort(callback: (a: T, b: T) => number): Collection<T> {
    return new Collection([...this.items].sort(callback));
  }

  sortBy(key: string, descending: boolean = false): Collection<T> {
    const sorted = [...this.items].sort((a: any, b: any) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return descending ? 1 : -1;
      if (aVal > bVal) return descending ? -1 : 1;
      return 0;
    });
    return new Collection(sorted);
  }

  push(item: T): this {
    this.items.push(item);
    return this;
  }

  count(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toArray(): T[] {
    return [...this.items];
  }

  toJSON(): T[] {
    return this.items.map((item: any) => {
      return typeof item.toJSON === 'function' ? item.toJSON() : item;
    });
  }

  *[Symbol.iterator]() {
    yield* this.items;
  }
}

/**
 * PaginatedCollection with pagination metadata
 */
export interface PaginationMeta {
  currentPage?: number;
  perPage?: number;
  total?: number;
  lastPage?: number;
  hasMore?: boolean;
}

export class PaginatedCollection<T = any> extends Collection<T> {
  private pagination: PaginationMeta = {};

  constructor(items: T[] = [], pagination: PaginationMeta = {}) {
    super(items);
    this.pagination = pagination;
  }

  getCurrentPage(): number {
    return this.pagination.currentPage || 1;
  }

  getPerPage(): number {
    return this.pagination.perPage || this.items.length;
  }

  getTotal(): number {
    return this.pagination.total || this.items.length;
  }

  getLastPage(): number {
    return this.pagination.lastPage || 1;
  }

  hasMore(): boolean {
    return this.pagination.hasMore || this.getCurrentPage() < this.getLastPage();
  }

  getPagination(): PaginationMeta {
    return this.pagination;
  }

  isFirstPage(): boolean {
    return this.getCurrentPage() === 1;
  }

  isLastPage(): boolean {
    return this.getCurrentPage() === this.getLastPage();
  }

  toJSON(): any {
    return {
      data: super.toJSON(),
      pagination: this.pagination,
    };
  }
}
