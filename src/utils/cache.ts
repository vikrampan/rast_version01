interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<unknown>>;
  private defaultDuration: number;

  private constructor() {
    this.cache = new Map();
    this.defaultDuration = 30000; // 30 seconds default
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, data: T, duration?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (duration || this.defaultDuration)
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Gets the default cache duration in milliseconds
   */
  getDefaultDuration(): number {
    return this.defaultDuration;
  }

  /**
   * Sets the default cache duration in milliseconds
   */
  setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }
}

export const globalCache = Cache.getInstance();