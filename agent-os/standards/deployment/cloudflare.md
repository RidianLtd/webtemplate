# Cloudflare Pages Deployment

## Configuration

### Build Settings

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js version:** 20.x
- **Package manager:** npm

### Environment Variables

Set in GitHub Actions secrets:

| Variable | Purpose | Required |
|----------|---------|----------|
| `CLOUDFLARE_API_TOKEN` | API authentication | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier | Yes |

## Deployment Workflow

### Automatic Deploys

1. Push to `main` branch triggers GitHub Actions
2. Actions builds the site
3. Wrangler deploys to Cloudflare Pages
4. Site updates within ~2 minutes

### Build Process

```
1. Clone repository
2. Install dependencies (npm ci)
3. Run build (npm run build)
4. Deploy dist/ to Cloudflare Pages
```

## Domain Setup

### Custom Domain

1. Add domain in Cloudflare Pages settings
2. Configure DNS (CNAME to *.pages.dev)
3. SSL certificate auto-provisioned

### Redirects

Create `public/_redirects` for URL redirects:

```
/old-page  /new-page  301
/legacy/*  /new/:splat  301
```

### Headers

Create `public/_headers` for custom headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

/uploads/*
  Cache-Control: public, max-age=31536000
```

## Performance

### Caching

Cloudflare automatically caches static assets:

- Images: Long-term cache via headers
- CSS/JS: Version-hashed filenames for cache busting

### Edge Network

- Content served from 300+ global locations
- Automatic compression (Brotli/gzip)
- HTTP/3 enabled

## Troubleshooting

### Build Failures

1. Check build logs in GitHub Actions
2. Verify Node.js version matches local
3. Run `npm run build` locally to reproduce

### Deploy Not Updating

1. Check GitHub Actions for errors
2. Verify Cloudflare API token has Pages permissions
3. Check browser cache - try hard refresh

## Limits (Free Tier)

- 500 builds per month
- 100 custom domains
- Unlimited bandwidth
- Unlimited requests
- 25 MB max file size

## Security

### Recommended Headers

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Secrets Management

- Never commit secrets to repository
- Use GitHub Actions secrets for deployment credentials
- Use Cloudflare secrets for OAuth worker
