declare module 'ioredis' {
  interface RedisOptions { maxRetriesPerRequest?: number; lazyConnect?: boolean; enableAutoPipelining?: boolean; }
  class Redis {
    constructor(url?: string, opts?: RedisOptions);
    eval(script: string, numKeys: number, ...args: any[]): Promise<any>;
  }
  export = Redis;
}
