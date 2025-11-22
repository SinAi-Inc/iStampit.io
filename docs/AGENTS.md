# AI Agent Context & Project State

**Last Updated:** November 21, 2025
**Project:** iStampit.io - Blockchain Timestamping Platform
**Status:** Production Ready (v1.0+) | Live: istampit.io | API: istampit-api.fly.dev

---

## 📋 Quick Context for AI Assistants

This document helps AI agents quickly understand the project state and continue work seamlessly.

### What is iStampit.io?

A **privacy-first timestamping platform** using OpenTimestamps protocol to anchor cryptographic hashes of digital artifacts to Bitcoin blockchain. Users get immutable proof-of-existence without revealing file contents.

**Core Functionality:**
- **Stamp**: Upload file → SHA-256 hash → Bitcoin anchor → .ots receipt
- **Verify**: Upload .ots + file → verify hash → check blockchain confirmation
- **Ledger**: Browse public registry of all timestamps (metadata only)
- **Widget**: One-line embeddable verification for third-party sites
- **API**: RESTful endpoints for automation (/stamp, /verify, /stamp-file)

### Recent Major Updates (Nov 21, 2025)

✅ **Ledger Automation Fixed**
- Resolved nightly workflow failures (monorepo path issues)
- Cleaned 6,510 duplicate nested .ots.bak entries
- Removed 48 orphaned references from deleted Aug-Sept files
- Status: 18 clean entries (12 confirmed, 6 pending)

✅ **API Enhanced**
- Added POST /verify endpoint with Bitcoin confirmation detection
- Added POST /stamp-file for direct file uploads
- Bitcoin attestation detection (0x05 0x88 marker)
- Block height extraction from receipts
- Comprehensive documentation and usage examples

✅ **Security Fixed**
- Patched glob vulnerability (10.4.5 → 10.5.0)
- Current status: 0 vulnerabilities

✅ **Documentation Organized**
- All docs moved to docs/ directory
- Created API_QUICK_REFERENCE.md for easy integration
- Clean project root with only README.md and AGENTS.md

---

## 🏗️ Project Architecture

```
iStampit.io/
├── istampit-web/              # Next.js 15 frontend + API routes
│   ├── app/                   # Pages: /, /stamp, /verify, /ledger, /embed
│   │   ├── api/               # Node.js API routes (stamp, session, healthz)
│   │   ├── components/        # React components
│   │   └── lib/               # Utilities, OTS verification, analytics
│   ├── styles/                # TailwindCSS + Design System
│   └── public/                # Static assets, embed widget, artifacts
├── istampit-cli/              # Python CLI tool (pip installable)
├── istampit-action/           # GitHub Action for CI/CD
├── api/                       # Standalone FastAPI service (Fly.io)
│   ├── app.py                 # FastAPI app with /stamp, /verify, /stamp-file
│   ├── README.md              # API endpoint documentation
│   ├── USAGE_EXAMPLES.md      # Real-world integration patterns
│   └── test_api.py            # Test suite
├── docs/                      # ALL documentation (organized)
│   ├── API_QUICK_REFERENCE.md # Common commands and examples
│   ├── SECURITY.md            # Security practices
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   ├── HOSTING.md             # Deployment guide
│   └── [other docs...]
├── scripts/                   # Automation utilities
│   ├── update-ledger-status.js    # Bitcoin confirmation checker
│   ├── cleanup-ledger.js          # Remove nested chains
│   └── remove-orphaned-entries.js # Clean dead references
├── artifacts/                 # Stamped artifacts (only recent Nov 17-21)
├── ledger.json                # Public innovation ledger (18 entries)
└── README.md                  # Main project README (clean & focused)
```

**Tech Stack:**
- Frontend: Next.js 15.4.6, React 19, TypeScript, TailwindCSS
- API: FastAPI (Python 3.11+) + Node.js API routes
- Blockchain: Bitcoin via OpenTimestamps calendars
- Deployment: Vercel (web) + Fly.io (API)
- Automation: GitHub Actions (workflows every 6 hours)

---

## ✅ Recent Fixes Applied (Nov 2025)

### Fix #1: API Route Configuration
**File:** `istampit-web/app/api/stamp/route.ts`
**Change:** `export const dynamic = 'force-dynamic'` (was `'force-static'`)
**Reason:** Route spawns CLI subprocess; requires dynamic execution
**Status:** ✅ Fixed and tested

### Validation Completed
- ✅ Build system: Clean builds, zero TypeScript/ESLint errors
- ✅ Dev server: Running successfully on localhost:3000
- ✅ Architecture: Hybrid deployment validated (static + API routes)
- ✅ Design system: Enterprise CSS loaded and working
- ✅ Widget: Embed system functional with PostMessage API
- ✅ Verification: OTS lite implementation working correctly

---

## 🎯 Current Status

### What's Working
- ✅ All pages render correctly (home, stamp, verify, ledger, embed)
- ✅ Design system fully integrated (400+ lines of semantic tokens)
- ✅ API routes configured properly
- ✅ Build process optimized (19s production build)
- ✅ Security: CSP headers, SLSA provenance, Cosign signatures
- ✅ Accessibility: WCAG AA compliance, keyboard navigation
- ✅ Mobile responsive design with dark mode support

### Known Limitations
- ⚠️ Rate limiting: In-memory by default (needs Redis for production)
- ⚠️ CLI integration: Requires `istampit` Python CLI on PATH
- ⚠️ Static export: API routes disabled in pure static mode
- ⚠️ Widget SRI: Content hashes need regeneration on widget updates

---

## 🔧 Environment Configuration

### Development (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_AUTH_ORIGIN=http://localhost:3000
STATIC_EXPORT=0
```

### Production (.env.production)
```bash
NODE_ENV=production
ENABLE_REDIS=1
REDIS_URL=redis://production-instance:6379
# OR
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
STATIC_EXPORT=0  # Keep API routes active
```

---

## 📝 Next Steps & Priorities

### Critical (Before Production Launch)
1. **Redis Setup**: Configure production Redis instance for rate limiting
2. **CLI Integration**: Test `istampit` CLI in deployment environment
3. **Domain Config**: Set production domain for CORS/CSP headers
4. **Monitoring**: Set up error tracking (Sentry or similar)
5. **Load Testing**: Test `/api/stamp` under production load

### High Priority (Week 1-2)
1. **Performance**: Load test API endpoints
2. **Widget Testing**: Verify embedding on external domains
3. **Analytics**: Complete Google Analytics integration
4. **Documentation**: Update deployment guides with learnings

### Medium Priority (Month 1)
1. **Enhanced Analytics**: Detailed event tracking
2. **Backup System**: Test automated backup/restore
3. **User Onboarding**: Improve first-time user experience
4. **API Documentation**: Interactive API docs (Swagger/OpenAPI)

### Nice to Have
1. **Batch Stamping**: API endpoint for multiple hashes
2. **WebSocket**: Real-time Bitcoin confirmation updates
3. **Advanced Filtering**: Enhanced ledger search capabilities
4. **Export Features**: CSV/JSON export from ledger

---

## 🐛 Known Issues & Quirks

### Non-Issues (Working as Designed)
- `cv-auto` class in HomeClient.tsx: Intentional performance optimization using `content-visibility: auto`
- Static export warnings: Expected when using redirects in hybrid mode
- npm warnings about workspace config: Harmless, can be ignored

### Real Issues (If Any Found)
None currently identified. Platform is production-ready.

---

## 🔍 How to Verify Platform Health

```bash
# 1. Check build
cd istampit-web
npm run build
# Should complete in ~20-30s with no errors

# 2. Start dev server
npm run dev
# Should start on http://localhost:3000

# 3. Run linting
npm run lint
# Should show: "✓ No ESLint warnings or errors"

# 4. Check TypeScript
npx tsc --noEmit
# Should complete with no errors

# 5. Test API endpoint
curl -X POST http://localhost:3000/api/stamp \
  -H "Content-Type: application/json" \
  -d '{"hash":"'$(echo -n "test" | sha256sum | cut -d' ' -f1)'"}'
# Should return JSON with receipt or rate limit error
```

---

## 📚 Key Documentation References

**For Development:**
- Architecture: This file (AGENTS.md)
- API Reference: `artifacts/api-spec-20250812.md`
- Design System: `istampit-web/styles/design-system.css`
- Component Library: `istampit-web/components/ds/`

**For Deployment:**
- Hosting Guide: `docs/HOSTING.md`
- Security: `docs/SECURITY.md`
- Release Process: `docs/RELEASE.md`

**For Contributing:**
- Guidelines: `docs/CONTRIBUTING.md`
- Code of Conduct: `docs/CODE_OF_CONDUCT.md`
- Project Status: `docs/PROJECT_STATUS.md`

---

## 🤖 Tips for AI Agents

### When Starting a Session
1. Read this file first for context
2. Check `docs/PROJECT_STATUS.md` for detailed feature status
3. Review recent git commits for latest changes
4. Run `npm run lint` and `npm run build` to verify health

### When Making Changes
1. Always test locally first: `npm run dev`
2. Check for TypeScript errors: `npx tsc --noEmit`
3. Run linting: `npm run lint`
4. Test production build: `npm run build`
5. Update this file if significant changes made

### Common Commands
```bash
# Development
cd istampit-web && npm run dev

# Build & Test
npm run build
npm run lint
npm test

# Check errors
npx tsc --noEmit
npm run lint --fix

# Deploy to Vercel
vercel --prod

# Check git status
git status
git log -5 --oneline
```

### File Locations Cheat Sheet
- API routes: `istampit-web/app/api/*/route.ts`
- Pages: `istampit-web/app/*/page.tsx`
- Components: `istampit-web/components/`
- Styles: `istampit-web/app/globals.css`, `istampit-web/styles/design-system.css`
- Config: `istampit-web/next.config.js`, `istampit-web/tailwind.config.js`
- Types: `istampit-web/types/`
- Documentation: `docs/`

---

## 🚨 Critical Notes

### DO NOT
- ❌ Change `output: 'export'` in next.config.js for production (breaks API routes)
- ❌ Remove `force-dynamic` from `/api/stamp/route.ts` (breaks CLI spawning)
- ❌ Delete or move files from `public/widget/` (breaks embeds)
- ❌ Modify `ledger.json` directly (use ledger management scripts)
- ❌ Commit `.env.local` or secrets to git

### ALWAYS
- ✅ Test changes with `npm run dev` before committing
- ✅ Run `npm run build` to verify production builds work
- ✅ Update documentation when making significant changes
- ✅ Check for TypeScript/ESLint errors before pushing
- ✅ Keep this file updated with project state changes

---

## 📊 Project Metrics

**Build Performance:**
- Build time: ~20-30 seconds
- Bundle size: 99.9 kB shared JS
- Pages: 16 static routes
- API routes: 3 dynamic endpoints

**Code Quality:**
- TypeScript: 100% coverage with strict mode
- ESLint: Zero errors
- Security: CodeQL passing
- Tests: Core verification logic covered

**User Experience:**
- Mobile responsive: ✅ All breakpoints
- Accessibility: ✅ WCAG AA compliant
- Load time: < 2 seconds
- Lighthouse score: High 90s

---

## 🔄 Version History

- **v1.0.0** (Aug 2025): Initial production release
- **Nov 2025**: API route fix, documentation reorganization, production validation

---

## 📞 Getting Help

**For AI Agents:**
- Context unclear? Read `docs/PROJECT_STATUS.md` for detailed status
- Build errors? Check `istampit-web/README.md` for troubleshooting
- API questions? See `artifacts/api-spec-20250812.md`

**For Humans:**
- GitHub Issues: https://github.com/SinAi-Inc/iStampit.io/issues
- Security: See `docs/SECURITY.md`
- Contributing: See `docs/CONTRIBUTING.md`

---

*This file is maintained to help AI assistants pick up exactly where the last session left off. Update it whenever project state changes significantly.*
