declare module 'ioredis' {
  interface RedisOptions { maxRetriesPerRequest?: number; lazyConnect?: boolean; enableAutoPipelining?: boolean; }
  class Redis {
    constructor(url?: string, opts?: RedisOptions);
    eval(script: string, numKeys: number, ...args: any[]): Promise<any>;
    set(key: string, value: string, mode?: string, ttl?: number): Promise<any>;
    del(key: string): Promise<any>;
    disconnect(): void;
  }
  export = Redis;
}
