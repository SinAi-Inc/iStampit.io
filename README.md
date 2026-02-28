# iStampit.io - Blockchain Timestamping Platform

[![CI](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/ci.yml/badge.svg)](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/ci.yml)
[![Pages](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/pages.yml/badge.svg)](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/pages.yml)
![CLI CI](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/cli.yml/badge.svg)
![CodeQL](https://github.com/SinAi-Inc/iStampit.io/actions/workflows/codeql.yml/badge.svg)

![Project preview](https://github.com/user-attachments/assets/977c8aa8-488b-4739-a2e4-c6c3997f5adf)

**Privacy-first blockchain timestamping using OpenTimestamps protocol.** Create immutable proof-of-existence for digital artifacts anchored to Bitcoin blockchain - without revealing file contents.

> **Status:** Production Ready (v1.0+) | **Live:** [istampit.io](https://istampit.io) | **API:** [istampit-api.fly.dev](https://istampit-api.fly.dev)

## ✨ What is iStampit?

iStampit provides cryptographic proof that a digital file existed at a specific point in time:

1. **Hash** your file locally (SHA-256) - never uploading content
2. **Anchor** the hash to Bitcoin blockchain via OpenTimestamps
3. **Generate** a .ots receipt file as proof
4. **Verify** timestamps independently at any time

**Use Cases:**

- Prove when code was written (commit timestamps)
- Timestamp research papers and datasets
- Verify document authenticity
- Create audit trails for compliance
- Protect intellectual property

## 🚀 Quick Start

### Web Interface

Visit **[istampit.io](https://istampit.io)** to:

- Drag & drop files for instant timestamping
- Verify existing timestamps with .ots receipts
- Browse the public Innovation Ledger
- Generate embeddable verification widgets

### API Access

```bash
# Stamp a hash
curl -X POST https://istampit-api.fly.dev/stamp \
  -H "Content-Type: application/json" \
  -d '{"hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'

# Stamp a file directly
curl -X POST https://istampit-api.fly.dev/stamp-file \
  -F "file=@document.pdf"

# Verify a timestamp
curl -X POST https://istampit-api.fly.dev/verify \
  -H "Content-Type: application/json" \
  -d '{"hash": "e3b0c44...", "receiptB64": "AE9wZW5UaW1lc3RhbXBzAA..."}'
```

See **[API_QUICK_REFERENCE.md](./docs/API_QUICK_REFERENCE.md)** for complete API documentation.

### Command Line

```bash
# Install CLI
pip install istampit-cli

# Stamp a file
istampit stamp document.pdf

# Verify timestamp
istampit verify document.pdf document.pdf.ots
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Timestamp Release
  run: |
    HASH=$(git rev-parse HEAD)
    curl -X POST https://istampit-api.fly.dev/stamp \
      -H "Content-Type: application/json" \
      -d "{\"hash\": \"$HASH\"}" > timestamp.json
```

## 🏗️ Architecture

```text
iStampit.io/
├── istampit-web/        # Next.js frontend + API routes
│   ├── app/             # Pages: /, /stamp, /verify, /ledger
│   ├── components/      # React components
│   └── public/          # Static assets + embed widget
├── istampit-cli/        # Python CLI tool
├── istampit-action/     # GitHub Action
├── api/                 # Standalone FastAPI service
│   ├── app.py           # Endpoints: /stamp, /verify, /stamp-file
│   └── USAGE_EXAMPLES.md
├── docs/                # All documentation
├── scripts/             # Automation scripts
└── ledger.json          # Public innovation ledger
```

**Stack:**

- Frontend: Next.js 15, React 19, TypeScript, TailwindCSS
- API: FastAPI (Python) + Node.js API routes
- Blockchain: Bitcoin via OpenTimestamps
- Deployment: Vercel (web) + Fly.io (API)

## 📚 Features

### Timestamping

- **Web Interface**: Drag & drop files or paste hashes
- **API**: RESTful endpoints for automation
- **CLI**: Command-line tool for scripts
- **Privacy**: Only hashes transmitted, never file contents
- **Free**: No account required, open source

### Verification

- **Instant**: Upload .ots receipt + file for verification
- **Bitcoin Confirmed**: See blockchain confirmation status
- **Independent**: Verify locally without trusting third parties
- **Hash-only**: Verify using SHA-256 when files are sensitive

### Innovation Ledger

- **Public Registry**: Transparent log of all timestamps
- **Searchable**: Filter by status, date, content type
- **Statistics**: Track confirmed vs pending
- **Automated**: Daily workflow stamps repository state

### Embed Widget

Drop-in verification for any website:

```html
<script src="https://istampit.io/widget/v1.js" async></script>
<div data-istampit-verify data-mode="inline" data-theme="light"></div>
```

### Automation

- **GitHub Action**: `SinAi-Inc/istampit-action`
- **Daily Stamping**: Automated artifact timestamping
- **CI/CD Ready**: Integrate into build pipelines
- **Rate Limited**: Fair use for all users

## 📖 Documentation

### Getting Started

- **[Quick Reference](./docs/API_QUICK_REFERENCE.md)** - Common commands and examples
- **[Usage Examples](./api/USAGE_EXAMPLES.md)** - Real-world integration patterns
- **[API Documentation](./api/README.md)** - Complete endpoint reference

### For Developers

- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute
- **[Architecture](./docs/AGENTS.md)** - System design and context
- **[Security](./docs/SECURITY.md)** - Security practices and policies
- **[Hosting](./docs/HOSTING.md)** - Deployment guide

### Project Info

- **[Changelog](./docs/CHANGELOG.md)** - Version history
- **[Project Status](./docs/PROJECT_STATUS.md)** - Current state
- **[Release Notes](./docs/RELEASE.md)** - Release process
- **[Code of Conduct](./docs/CODE_OF_CONDUCT.md)** - Community guidelines

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/SinAi-Inc/iStampit.io.git
cd iStampit.io

# Install dependencies
npm install

# Run development server
cd istampit-web
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Update ledger status
node scripts/update-ledger-status.js
```

### Prerequisites

- Node.js 20+
- npm 10+
- Python 3.11+ (for CLI)

### Monorepo Structure

This is an npm workspaces monorepo:

- `istampit-web` - Web frontend
- `istampit-cli` - Python CLI
- `istampit-action` - GitHub Action

## 🔐 Security

All releases are signed with Sigstore Cosign and include SLSA v3 provenance.

**Security Features:**

- Zero vulnerabilities (verified with npm audit)
- Content Security Policy (CSP) headers
- CORS protection on API endpoints
- Rate limiting on all endpoints
- Sandboxed embed widget (iframe isolation)
- No file uploads (hash-only transmission)

Report security issues to: <security@istampit.io>

See **[SECURITY.md](./docs/SECURITY.md)** for verification instructions.

## 📊 Current Status

- **Ledger**: 18 entries (12 confirmed, 6 pending)
- **Automation**: Fixed and running (every 6 hours)
- **API**: Enhanced with verification endpoints
- **Security**: 0 vulnerabilities
- **Build**: Clean (0 errors, 0 warnings)

## 🤝 Contributing

We welcome contributions! See **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** for guidelines.

**Quick Contributions:**

- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features or improvements
- 📝 Improve documentation
- 🔧 Submit pull requests

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with:

- [OpenTimestamps](https://opentimestamps.org/) - Bitcoin timestamping protocol
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python API framework
- [Bitcoin](https://bitcoin.org/) - Blockchain infrastructure

## 📞 Support

- **Website**: [istampit.io](https://istampit.io)
- **API**: [istampit-api.fly.dev](https://istampit-api.fly.dev)
- **GitHub**: [SinAi-Inc/iStampit.io](https://github.com/SinAi-Inc/iStampit.io)
- **Issues**: [GitHub Issues](https://github.com/SinAi-Inc/iStampit.io/issues)
- **Documentation**: [docs/](./docs/)

---

Made with ❤️ by [SinAI Inc](https://github.com/SinAi-Inc) | Powered by Bitcoin & OpenTimestamps
