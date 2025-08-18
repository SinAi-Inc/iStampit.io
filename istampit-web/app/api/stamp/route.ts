import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import Redis from 'ioredis';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = false;

function run(cmd: string, args: string[]): Promise<{ stdout: string; stderr: string }>{
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore','pipe','pipe'] });
    let out = ''; let err='';
    p.stdout.on('data', d => out += d.toString());
    p.stderr.on('data', d => err += d.toString());
    p.on('error', reject);
    p.on('close', code => {
      if (code === 0) resolve({ stdout: out.trim(), stderr: err.trim() });
      else reject(new Error(err.trim() || out.trim() || `exit ${code}`));
    });
  });
}

function validateHash(h: unknown): h is string { return typeof h === 'string' && /^[a-fA-F0-9]{64}$/.test(h); }

// Sliding window + burst limiter (in-memory). For production, back with Redis or durable KV.
interface RateEntry { count: number; windowStart: number; recent: number[]; }
const WINDOW_MS = 60_000;              // primary window
const MAX_PER_WINDOW = 60;             // total per full minute
const SHORT_WINDOW_MS = 10_000;        // short rolling window for bursts
const MAX_PER_SHORT = 15;              // limit bursts (e.g., 15 in 10s)

let redis: Redis | null = null;
const redisEnabled = /^(1|true|yes)$/i.test(process.env.ENABLE_REDIS || '');
const redisUrl = redisEnabled ? (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) : undefined;
if (redisEnabled && redisUrl) {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      enableAutoPipelining: true
    });
  } catch {
    // Swallow init errors; fallback to in-memory limiter. Purposefully not logging to avoid noisy builds.
    redis = null;
  }
}

const memState = new Map<string, RateEntry>();

async function take(ip: string){
  if (redis) {
    try {
      const keyWindow = `stamp:wl:${ip}`; // minute window
      const keyRecent = `stamp:sr:${ip}`; // short recent list
      const now = Date.now();
      const minuteKeyExpire = Math.ceil(WINDOW_MS/1000);
      const shortExpire = Math.ceil(SHORT_WINDOW_MS/1000);
      // Use atomic Lua script: increment counters, enforce limits
      const script = `
local keyWindow=KEYS[1]; local keyRecent=KEYS[2]; local maxWindow=tonumber(ARGV[1]); local maxShort=tonumber(ARGV[2]); local now=tonumber(ARGV[3]); local shortMs=tonumber(ARGV[4]); local windowTtl=tonumber(ARGV[5]); local shortTtl=tonumber(ARGV[6]);
-- increment window counter
local wc=redis.call('INCR', keyWindow)
if wc==1 then redis.call('PEXPIRE', keyWindow, shortMs*6) end
if wc>maxWindow then return 0 end
-- add timestamp to recent zset
redis.call('ZADD', keyRecent, now, now)
redis.call('ZREMRANGEBYSCORE', keyRecent, 0, now - shortMs)
local rc=redis.call('ZCARD', keyRecent)
if rc==1 then redis.call('PEXPIRE', keyRecent, shortMs) end
if rc>maxShort then return 0 end
return 1
`;
      const allowed = await redis.eval(script, 2, keyWindow, keyRecent, `${MAX_PER_WINDOW}`, `${MAX_PER_SHORT}`, `${Date.now()}`, `${SHORT_WINDOW_MS}`, `${WINDOW_MS}`, `${SHORT_WINDOW_MS}`) as number;
      return allowed === 1;
    } catch { /* fallback to memory */ }
  }
  const now = Date.now();
  let e = memState.get(ip);
  if(!e){ e = { count:0, windowStart: now, recent: [] }; memState.set(ip, e); }
  if (now - e.windowStart >= WINDOW_MS){ e.count = 0; e.windowStart = now; }
  e.recent = e.recent.filter(ts => now - ts < SHORT_WINDOW_MS);
  if (e.count >= MAX_PER_WINDOW) return false;
  if (e.recent.length >= MAX_PER_SHORT) return false;
  e.count += 1; e.recent.push(now);
  return true;
}

export async function POST(req: NextRequest){
  try {
    const body = await req.json().catch(()=>({}));
    const hash = body.hash;
    if(!validateHash(hash)) return json({ error: 'invalid_hash' }, 400);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anon';
    if(!take(ip)) return json({ error: 'rate_limited' }, 429);
    const filename = `${hash}.ots`;
    const tmp = join(tmpdir(), `${hash}-${randomUUID()}.ots`);
    try { await run('istampit', ['stamp','--hash', hash, '--out', tmp, '--json']); }
    catch(e:any){ return json({ error: 'stamp_failed', message: e?.message||String(e) }, 500); }
    const buf = await fs.readFile(tmp).catch(()=>Buffer.from([]));
    await fs.rm(tmp).catch(()=>{});
    if(!buf.length) return json({ error: 'empty_receipt' }, 500);
    return json({ hash: hash.toLowerCase(), filename, size: buf.length, receiptB64: buf.toString('base64') });
  } catch(e:any){
    return json({ error: 'unexpected', message: e?.message||String(e) }, 500);
  }
}

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const m = url.pathname.match(/\/api\/stamp\/([a-fA-F0-9]{64})\.ots$/);
  if(!m) return json({ error: 'not_found' }, 404);
  const hash = m[1];
  if(!validateHash(hash)) return json({ error: 'invalid_hash' }, 400);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anon';
  if(!take(ip)) return json({ error: 'rate_limited' }, 429);
  const tmp = join(tmpdir(), `${hash}-${randomUUID()}.ots`);
  try {
    await run('istampit', ['stamp','--hash', hash, '--out', tmp]);
  const buf = await fs.readFile(tmp);
  const copy = new Uint8Array(buf.byteLength);
  copy.set(buf);
  return new Response(copy, { status: 200, headers: { 'Content-Type':'application/octet-stream', 'Content-Disposition':`attachment; filename="${hash}.ots"`, 'Cache-Control':'no-store' } });
  } catch(e:any){
    return json({ error: 'stamp_failed', message: e?.message||String(e) }, 500);
  } finally { await fs.rm(tmp).catch(()=>{}); }
}

function json(obj: any, status=200){ return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type':'application/json','Cache-Control':'no-store' }}); }
