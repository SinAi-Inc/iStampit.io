# iStampit Auth

Minimal Next.js app providing authentication (Google OAuth via NextAuth) for iStampit.

## Environment Variables

Set the following in Vercel Project Settings:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
- NEXTAUTH_URL (e.g. https://app.istampit.io)

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3001

## Deployment

Deploy this `istampit-auth` directory to Vercel. Configure custom domain `app.istampit.io` pointing to the Vercel project.

## Notes

This app intentionally has no static export and no marketing pages.
