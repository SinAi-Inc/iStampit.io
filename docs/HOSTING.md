# Hosting

Hybrid deployment (dynamic API routes + static pages). Requirements & environment variables below.

## Runtime Requirements

| Concern | Requirement | Notes |
|---------|-------------|-------|
| Node.js | 20.x | Matches `engines` & Next build target |
| Child Processes | Enabled | Needed for spawning `istampit` CLI |
| Python (optional) | 3.9+ | If installing CLI from source inside container |
| Redis (optional) | Managed or self-hosted | For persistent rate limiting |
| Memory | ~256MB+ | In-memory limiter + Next server |
| Port | 3000 | Default `next start` port |

## Environment Variable Matrix

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| ENABLE_REDIS | Toggle Redis-backed limiter | unset (false) | `1` |
| REDIS_URL | Redis connection (ioredis) | none | `redis://user:pass@host:6379/0` |
| UPSTASH_REDIS_REST_URL | Upstash REST URL (alternative) | none | `https://xyz.upstash.io` |
| NEXTAUTH_URL | Session proxy target | none | `https://app.example.com` |
| ISTAMPIT_ENABLE_SESSION_PROXY | Enable live session proxy | unset | `1` |
| NODE_ENV | Optimize runtime | `development` | `production` |
| PORT | Custom listen port (container) | 3000 | `8080` |
| ISTAMPIT_CLI_PATH | Override istampit binary path | `istampit` | `/usr/local/bin/istampit` |
| RATE_LIMIT_WINDOW_MS | Override minute window | 60000 | `60000` |
| RATE_LIMIT_MAX_PER_WINDOW | Window max | 60 | `120` |
| RATE_LIMIT_SHORT_WINDOW_MS | Burst window | 10000 | `10000` |
| RATE_LIMIT_MAX_PER_SHORT | Burst max | 15 | `30` |

## Deployment Steps (Container Example)

1. Build image: `docker build -t istampit .`
2. Run: `docker run -p 3000:3000 istampit`
3. (Optional) Redis: supply `--env ENABLE_REDIS=1 --env REDIS_URL=redis://...`

## Health Check

`GET /api/healthz` returns `{ redis: ok|down|disabled, memoryLimiter: ok }` for monitoring.

## Legacy

Older static-only / auth-specific documentation removed. Revisit git history if reintroducing a dedicated auth service.
