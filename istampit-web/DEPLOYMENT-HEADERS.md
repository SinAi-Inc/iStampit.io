# Production Deployment Headers

Since iStampit.io uses `output: 'export'` for static site generation, security headers must be configured at the deployment level (web server, CDN, or hosting platform).

## Required Security Headers

```nginx
# Nginx Configuration
add_header Referrer-Policy "no-referrer" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Permissions-Policy "clipboard-read=self, clipboard-write=self" always;
add_header X-Frame-Options "SAMEORIGIN" always;

# Widget caching
location /widget/ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
}
```

## Vercel Configuration

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Referrer-Policy",
          "value": "no-referrer"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Permissions-Policy",
          "value": "clipboard-read=self, clipboard-write=self"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    },
    {
      "source": "/widget/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Netlify Configuration

Create `_headers` file in the public directory:

```
/*
  Referrer-Policy: no-referrer
  X-Content-Type-Options: nosniff
  Permissions-Policy: clipboard-read=self, clipboard-write=self
  X-Frame-Options: SAMEORIGIN

/widget/*
  Cache-Control: public, max-age=31536000, immutable
```

## Apache Configuration

```apache
<IfModule mod_headers.c>
    Header always set Referrer-Policy "no-referrer"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Permissions-Policy "clipboard-read=self, clipboard-write=self"
    Header always set X-Frame-Options "SAMEORIGIN"

    <LocationMatch "^/widget/">
        Header always set Cache-Control "public, max-age=31536000, immutable"
    </LocationMatch>
</IfModule>
```
