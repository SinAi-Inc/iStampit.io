import type { NextRequest } from 'next/server';
import Redis from 'ioredis';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(_req: NextRequest) {
  const enableRedis = /^(1|true|yes)$/i.test(process.env.ENABLE_REDIS || '');
  let redisStatus: 'ok' | 'down' | 'disabled' = 'disabled';
  if (enableRedis) {
    const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
    if (url) {
      try {
        const r = new Redis(url, { maxRetriesPerRequest: 1, enableAutoPipelining: false });
        // Single round-trip: SET then DEL as a quick ping substitute (PING may not exist in REST emulation)
        await r.set('healthz:ping', '1', 'PX', 2000);
        await r.del('healthz:ping');
        redisStatus = 'ok';
        r.disconnect();
      } catch {
        redisStatus = 'down';
      }
    } else { redisStatus = 'down'; }
  }
  const memoryLimiter = 'ok';
  return new Response(JSON.stringify({ redis: redisStatus, memoryLimiter }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
