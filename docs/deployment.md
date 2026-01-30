# Deployment Guide

This guide covers deploying your site to Cloudflare Pages and configuring automated deployments.

## Cloudflare Pages Setup

### Creating a Pages Project

1. **Log in to Cloudflare Dashboard:** https://dash.cloudflare.com
2. **Navigate to Workers & Pages** in the left sidebar
3. **Click "Create application"**
4. **Select "Pages"**
5. **Choose "Direct Upload"**
   - We use GitHub Actions for deployment, not Git integration
   - This gives more control over the build process
6. **Name your project** (e.g., `my-site`)
   - This becomes your subdomain: `my-site.pages.dev`
   - Choose carefully - changing it later is difficult
7. **Click "Create project"**

### Getting Your Account ID

Your Cloudflare Account ID is needed for GitHub Actions.

**Method 1: URL**
Look at the URL when logged into Cloudflare:
```
https://dash.cloudflare.com/a1b2c3d4e5f6...
                          ^^^^^^^^^^^^^^^
                          This is your Account ID
```

**Method 2: Dashboard**
1. Go to Workers & Pages
2. Look in the right sidebar under "Account details"

### Creating an API Token

1. **Go to API Tokens:** https://dash.cloudflare.com/profile/api-tokens
2. **Click "Create Token"**
3. **Use "Edit Cloudflare Workers" template** or create custom:
   - Account: Cloudflare Pages: Edit
   - Account: Workers Scripts: Edit (optional, for OAuth worker)
4. **Click "Continue to summary"**
5. **Click "Create Token"**
6. **Copy the token immediately** (you cannot view it again)

## GitHub Actions Configuration

### Required Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **"New repository secret"**
3. Add each secret:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | Your API token from above |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID |

### Workflow Configuration

The workflow file is at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main  # Change if using different branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=your-project-name
```

**Update the project name** to match your Cloudflare Pages project.

### Environment Variables in Build

If your build needs environment variables:

```yaml
- name: Build
  run: npm run build
  env:
    SITE_URL: https://my-site.pages.dev
```

Or add them in Cloudflare Pages:
1. Go to your Pages project > Settings > Environment variables
2. Add variables for Production and/or Preview

## Deployment Options

### Automatic Deployment (Recommended)

Every push to `main` triggers a deployment:

```bash
git add .
git commit -m "Update content"
git push origin main
```

Watch the deployment:
1. Go to GitHub > Actions tab
2. Click the running workflow
3. View logs in real-time

### Manual Deployment

Deploy without pushing to Git:

```bash
# Build locally
npm run build

# Deploy with Wrangler
npx wrangler pages deploy dist --project-name=your-project-name
```

This requires `CLOUDFLARE_API_TOKEN` as an environment variable or Wrangler login.

### Preview Deployments

For pull request previews, add a preview workflow:

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    branches:
      - main

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - name: Deploy Preview
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=your-project-name --branch=${{ github.head_ref }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Preview deployed to: ${{ steps.deploy.outputs.deployment-url }}'
            })
```

## Environment Variables Reference

### Build Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_VERSION` | Node.js version | `20` |
| `SITE_URL` | Site URL for meta tags | `https://example.com` |

### Cloudflare Secrets

| Variable | Purpose | Where to Set |
|----------|---------|--------------|
| `CLOUDFLARE_API_TOKEN` | API authentication | GitHub Secrets |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier | GitHub Secrets |

### OAuth Worker Variables

| Variable | Purpose | Where to Set |
|----------|---------|--------------|
| `GITHUB_CLIENT_ID` | OAuth app ID | `wrangler.toml` |
| `GITHUB_CLIENT_SECRET` | OAuth secret | Wrangler secret |

## Custom Domain Setup

### Adding a Custom Domain

1. Go to **Cloudflare Pages** > **Your project** > **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain (e.g., `www.example.com` or `example.com`)
4. Choose configuration:
   - **CNAME** (for subdomains like `www`)
   - **A/AAAA** (for apex domain)
5. Add the DNS records Cloudflare provides

### DNS Configuration

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Content: your-project.pages.dev
Proxy: On (orange cloud)
```

**For apex domain (example.com):**
If using Cloudflare DNS:
```
Type: CNAME
Name: @
Content: your-project.pages.dev
Proxy: On (orange cloud)
```

If using external DNS:
```
Type: A
Name: @
Content: 192.0.2.1 (Cloudflare IP - check dashboard)
```

### SSL Certificate

Cloudflare automatically provisions SSL certificates:
- Usually ready in a few minutes
- Supports both apex and www
- Auto-renews

### Redirects

Create `public/_redirects` for URL redirects:

```
# Redirect www to non-www (or vice versa)
https://www.example.com/* https://example.com/:splat 301

# Redirect old pages
/old-page /new-page 301
/blog/* /posts/:splat 301
```

### Custom Headers

Create `public/_headers` for security headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/uploads/*
  Cache-Control: public, max-age=31536000
```

## Monitoring Deployments

### GitHub Actions

- View deployment status in the Actions tab
- Set up notifications for failed builds
- Check build logs for errors

### Cloudflare Dashboard

- View deployment history in Pages > Deployments
- See traffic analytics
- Monitor bandwidth usage

### Build Notifications

Add Slack/Discord notifications:

```yaml
- name: Notify on Success
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-type: application/json' \
      --data '{"text":"Deployed successfully!"}'

- name: Notify on Failure
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-type: application/json' \
      --data '{"text":"Deployment failed!"}'
```

## Troubleshooting

### Build Fails

1. **Check GitHub Actions logs** for error messages
2. **Run build locally** to reproduce:
   ```bash
   npm ci
   npm run build
   ```
3. **Verify Node version** matches `.nvmrc` and workflow

### Deployment Fails

1. **Check API token permissions** - needs Pages edit access
2. **Verify project name** matches Cloudflare Pages project exactly
3. **Check account ID** is correct

### Site Not Updating

1. **Check deployment completed** in GitHub Actions
2. **Hard refresh browser** (Ctrl/Cmd + Shift + R)
3. **Check Cloudflare caching** - try Development Mode temporarily
4. **Verify correct branch** is being deployed

### DNS Not Working

1. **Wait for propagation** - can take up to 24 hours
2. **Check DNS records** match Cloudflare instructions
3. **Verify proxy status** - orange cloud should be on
4. **Test with:** `dig example.com` or `nslookup example.com`

## Free Tier Limits

Cloudflare Pages free tier includes:

| Resource | Limit |
|----------|-------|
| Builds per month | 500 |
| Concurrent builds | 1 |
| Custom domains | 100 |
| Bandwidth | Unlimited |
| Requests | Unlimited |
| Max file size | 25 MB |

For most sites, these limits are more than sufficient.
