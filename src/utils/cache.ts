interface CacheItem<T> {
    data: T;
    timestamp: number;
  }
  
  export class Cache {
    private static instance: Cache;
    private cache: Map<string, CacheItem<any>>;
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
      const item = this.cache.get(key);
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
  }
  
  export const globalCache = Cache.getInstance();