# iStampit.io GA Deployment Checklist

## ✅ Pre-Deployment Verification

### Security & Integrity

- [x] PostMessage origin validation implemented with configurable allowlists
- [x] Subresource Integrity (SRI) enabled for widget files with SHA-256 hashing
- [x] Security headers configured (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- [x] Content-hashed widget builds with integrity verification
- [x] Origin-based access control for embedded communications

### Analytics & Privacy

- [x] Privacy-first analytics system with local storage (no PII collection)
- [x] Event tracking for verification flow (started, result, error)
- [x] Ledger analytics for page views and filter usage
- [x] Analytics data retention and cleanup policies
- [x] No sensitive data (hashes, personal info) in telemetry

### Operations & Monitoring

- [x] Production monitoring system with health metrics
- [x] Alert system for pending actions, response times, error rates
- [x] Receipt upgrade drift detection and monitoring
- [x] Backup system with export/import capabilities
- [x] Emergency restore procedures with integrity validation

### User Experience

- [x] Enhanced verification interface with copy buttons
- [x] Configurable Bitcoin explorer links (Mempool.space, Blockstream, custom)
- [x] Contextual error messages with helpful guidance
- [x] Responsive design with light/dark theme support
- [x] Accessibility compliance (keyboard navigation, screen readers)

### Integration & Versioning
- [x] Widget versioning system (/widget/v1.js alias)
- [x] Content-hashed widget files (v1.[hash].js)
- [x] SRI integrity attributes for secure embedding
- [x] Theme-aware embedding with customizable appearance
- [x] Multiple integration options (iframe, inline, modal)

## 🚀 Deployment Steps

### 1. Build & Test
```bash
# Build widget with content hashing
npm run build:widget

# Build application
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### 2. Version Tagging
```bash
# Tag the release
git tag -a v1.0.0 -m "GA Release: Complete hardening with security, analytics, and monitoring"

# Push tags
git push origin v1.0.0
```

### 3. Security Configuration
- [ ] Configure allowed origins for widget embedding
- [ ] Set up Content Security Policy headers
- [ ] Enable HTTPS-only mode
- [ ] Configure HSTS headers
- [ ] Set up proper CORS policies

### 4. Monitoring Setup
- [ ] Configure monitoring thresholds
- [ ] Set up alert notifications (email, Slack, etc.)
- [ ] Test backup and restore procedures
- [ ] Verify analytics data collection
- [ ] Set up error tracking and logging

### 5. Performance Optimization
- [ ] Enable CDN for static assets
- [ ] Configure proper cache headers
- [ ] Optimize image assets
- [ ] Enable compression (gzip/brotli)
- [ ] Monitor Core Web Vitals

## 📊 Post-Deployment Verification

### Functional Testing
- [ ] Verify file upload and hash generation
- [ ] Test OpenTimestamps verification flow
- [ ] Validate widget embedding functionality
- [ ] Check analytics event tracking
- [ ] Test backup/restore operations

### Security Testing
- [ ] Verify postMessage origin validation
- [ ] Test SRI integrity checking
- [ ] Validate security headers
- [ ] Check for XSS vulnerabilities
- [ ] Test CSRF protection

### Performance Testing
- [ ] Load time under 2 seconds
- [ ] Widget initialization under 500ms
- [ ] Verification response under 5 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Integration Testing
- [ ] Test widget in various environments
- [ ] Verify explorer links functionality
- [ ] Check theme switching
- [ ] Test error handling
- [ ] Validate API rate limiting

## 🔧 Configuration Files

### Environment Variables
```env
# Production settings
NODE_ENV=production
NEXT_PUBLIC_WIDGET_VERSION=v1.0.0
NEXT_PUBLIC_API_URL=https://api.istampit.io
NEXT_PUBLIC_ALLOWED_ORIGINS=https://partner1.com,https://partner2.com
```

### nginx Configuration (Example)
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), location=()" always;

# Widget caching
location /widget/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Cross-Origin-Resource-Policy "cross-origin";
}
```

## 📈 Monitoring & Alerting

### Key Metrics to Monitor
- Verification success rate (target: >99%)
- Average response time (target: <2s)
- Error rate (target: <1%)
- Widget load failures (target: <0.1%)
- Backup system health

### Alert Thresholds
- Pending actions > 100
- Response time > 5 seconds
- Error rate > 5%
- Receipt upgrade drift > 24 hours
- Backup age > 48 hours

### Health Check Endpoints
- `/api/health` - Basic health check
- `/api/metrics` - Detailed system metrics
- `/widget/v1.js` - Widget availability
- `/verify` - Verification system status

## 🛡️ Security Hardening

### HTTP Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), location=()
```

### Widget Integration Security
- Always use HTTPS for widget embedding
- Configure allowed origins list
- Validate postMessage sources
- Use SRI for script tags
- Implement timeout for widget loading

## 📋 Rollback Plan

### If Issues Arise
1. **Immediate**: Revert to previous widget version
2. **Monitor**: Check error rates and user reports
3. **Investigate**: Use monitoring dashboard to identify issues
4. **Fix**: Apply hotfixes if possible
5. **Redeploy**: Full rollback if necessary

### Emergency Procedures
- Widget rollback: Update /widget/v1.js symlink
- Database recovery: Use backup system
- Analytics reset: Clear localStorage data
- Monitoring reset: Clear alert history

## 🎯 Success Criteria

### Technical KPIs
- [ ] 99.9% uptime
- [ ] <2s average verification time
- [ ] <0.5% error rate
- [ ] Zero security incidents
- [ ] 100% SRI coverage

### User Experience KPIs
- [ ] Positive user feedback
- [ ] Successful widget integrations
- [ ] Mobile compatibility confirmed
- [ ] Accessibility compliance verified
- [ ] Performance benchmarks met

## 📞 Support & Escalation

### Contact Information
- **Primary**: [Your primary contact]
- **Secondary**: [Backup contact]
- **Emergency**: [Emergency escalation]

### Documentation Links
- User Guide: [Link to user documentation]
- Integration Guide: [Link to developer docs]
- API Reference: [Link to API docs]
- Troubleshooting: [Link to troubleshooting guide]

---

**Deployment Date**: [Fill in deployment date]
**Deployed By**: [Fill in deployer name]
**Sign-off**: [Fill in approval signatures]
