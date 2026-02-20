# Setup Guide

This guide walks through deploying your site from start to finish. Expected time: 30-60 minutes.

## Overview

The setup process involves:

1. Clone or use this template
2. Install dependencies
3. Create a GitHub OAuth App
4. Deploy the OAuth worker to Cloudflare
5. Configure Decap CMS
6. Set up Cloudflare Pages
7. Configure GitHub Actions secrets
8. Deploy

## Step 1: Clone or Use Template

### Option A: Use as GitHub Template

1. Click "Use this template" on the GitHub repository page
2. Name your new repository
3. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-repo-name.git
   cd your-repo-name
   ```

### Option B: Clone Directly

```bash
git clone https://github.com/TEMPLATE_OWNER/astro-decap-template.git my-site
cd my-site
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"
```

## Step 2: Install Dependencies

```bash
npm install
```

Verify the setup works:

```bash
npm run dev
```

Visit `http://localhost:4321` to see the site.

## Step 3: Create GitHub OAuth App

The CMS needs OAuth to authenticate editors with your GitHub repository.

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the details:

   | Field | Value |
   |-------|-------|
   | Application name | `Your Site CMS` (any name you like) |
   | Homepage URL | `https://your-site.pages.dev` (your eventual domain) |
   | Authorization callback URL | `https://your-oauth-worker.workers.dev/callback` |

5. Click "Register application"
6. Copy the **Client ID** (you will need this)
7. Click "Generate a new client secret"
8. Copy the **Client Secret** (save this securely - you cannot view it again)

> **Important:** The callback URL must point to your OAuth worker, not your site. The worker name is configured in `oauth-worker/wrangler.toml`.

## Step 4: Deploy OAuth Worker

The OAuth worker handles the GitHub authentication flow for Decap CMS.

### 4.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 4.2 Login to Cloudflare

```bash
wrangler login
```

This opens a browser to authenticate with your Cloudflare account.

### 4.3 Configure the Worker

Edit `oauth-worker/wrangler.toml`:

```toml
name = "your-site-oauth"  # Choose a unique name
main = "index.js"
compatibility_date = "2024-01-01"

[vars]
GITHUB_CLIENT_ID = "your_client_id_here"  # From Step 3
```

### 4.4 Set the Client Secret

```bash
cd oauth-worker
wrangler secret put GITHUB_CLIENT_SECRET
```

When prompted, paste your GitHub Client Secret from Step 3.

### 4.5 Deploy the Worker

```bash
wrangler deploy
```

Note the worker URL (e.g., `https://your-site-oauth.your-account.workers.dev`). You will need this for the next step.

## Step 5: Configure Decap CMS

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO  # Your GitHub repository
  branch: main
  base_url: https://your-site-oauth.workers.dev  # Your worker URL from Step 4
  auth_endpoint: /auth
```

Remove or set `local_backend: false` for production:

```yaml
# Comment out for production, or set to false
# local_backend: true
```

## Step 6: Set Up Cloudflare Pages

### 6.1 Create a Pages Project

1. Go to Cloudflare Dashboard: https://dash.cloudflare.com
2. Select "Workers & Pages" from the sidebar
3. Click "Create application"
4. Select "Pages"
5. Click "Create using direct upload" (we use GitHub Actions for deployment)
6. Name your project (e.g., `my-site`)
7. Click "Create project"

### 6.2 Get Your Account ID

1. In the Cloudflare dashboard, look at the URL
2. The account ID is the long string after `dash.cloudflare.com/`
3. Alternatively, find it in "Workers & Pages" > "Overview" on the right sidebar

### 6.3 Create an API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template, or create custom:
   - Account: Cloudflare Pages: Edit
   - Zone: (none needed for Pages)
4. Click "Continue to summary" and "Create Token"
5. Copy the token (you cannot view it again)

## Step 7: Configure GitHub Secrets

Your GitHub repository needs two secrets for automated deployment.

1. Go to your repository on GitHub
2. Click "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret" and add:

   | Name | Value |
   |------|-------|
   | `CLOUDFLARE_API_TOKEN` | Your API token from Step 6.3 |
   | `CLOUDFLARE_ACCOUNT_ID` | Your account ID from Step 6.2 |

## Step 8: Configure and Deploy

### 8.1 Update GitHub Actions Workflow

Edit `.github/workflows/deploy.yml` and replace the project name:

```yaml
command: pages deploy dist --project-name=your-project-name
```

Use the project name from Step 6.1.

### 8.2 First Deployment

Commit and push your changes:

```bash
git add .
git commit -m "Configure for deployment"
git push origin main
```

GitHub Actions will automatically build and deploy your site.

### 8.3 Verify Deployment

1. Check GitHub Actions: Your repository > "Actions" tab
2. Watch the deployment workflow run
3. Once complete, visit your site at `https://your-project.pages.dev`
4. Test CMS login at `https://your-project.pages.dev/admin`

## Troubleshooting

### Build Fails in GitHub Actions

- Check that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set correctly
- Verify the project name in `deploy.yml` matches your Cloudflare Pages project

### OAuth Login Fails

See [OAuth Troubleshooting](oauth-troubleshooting.md) for common issues.

### "No opener window" Error

This happens when the OAuth popup cannot communicate with the CMS. Ensure:

1. The callback URL in your GitHub OAuth App matches your worker URL + `/callback`
2. Your browser allows popups from your site

### Site Does Not Update After Push

1. Check GitHub Actions for build errors
2. Verify Cloudflare Pages is receiving the deployment
3. Check browser cache - try hard refresh (Ctrl/Cmd + Shift + R)

### Local CMS Development

For local development without OAuth:

```bash
# Terminal 1: Start the dev server
npm run dev

# Terminal 2: Start the local CMS backend
npx decap-server
```

Visit `http://localhost:4321/admin` to edit content locally.

## Custom Domain

After initial setup, you can add a custom domain:

1. Go to Cloudflare Pages > Your project > "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain (e.g., `www.example.com`)
4. Add the DNS records Cloudflare provides
5. Update your GitHub OAuth App URLs to use the new domain

## Editorial Workflow

The CMS is configured with `publish_mode: editorial_workflow`, which means content changes create draft pull requests on GitHub instead of committing directly to the main branch. This prevents accidental publishes and enables review before content goes live.

Editors will see "Draft", "In Review", and "Ready" columns in the CMS. Moving content to "Ready" and publishing merges the PR.

## Contact Form Handler

The template includes a working form API at `/api/enquiry`. To enable it:

1. Create a KV namespace: `npx wrangler kv namespace create FORM_SUBMISSIONS`
2. Add the namespace binding to `wrangler.toml`
3. Set `SITE_ORIGIN` env var in Cloudflare Pages to your production URL

See [Form Submission](form-submission.md) for full details.

## PostHog Analytics

PostHog is pre-wired but inactive. To activate:

1. Sign up at [posthog.com](https://posthog.com) and create a project
2. Open `src/layouts/BaseLayout.astro`
3. Replace `PLACEHOLDER` with your PostHog project API key

No tracking data is sent until you replace the placeholder. See [Analytics](analytics.md) for the full event reference.

## Next Steps

- [Customize brand identity](customization.md)
- [Add a blog collection](adding-collections.md)
- [Understand the architecture](architecture.md)
- [Set up form submissions](form-submission.md)
- [Configure analytics](analytics.md)
