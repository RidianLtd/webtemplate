# Tech Stack

## Overview

Webtemplate is a starter template for content-managed static websites. Built for performance, simplicity, zero hosting costs, and ease of content management by non-technical users.

## Core Technologies

### Framework and Build

- **Static Site Generator:** Astro 5.x
- **Language:** TypeScript (strict mode)
- **Build Output:** Static HTML/CSS/JS
- **Package Manager:** npm

### Styling

- **CSS Framework:** Tailwind CSS
- **Approach:** Utility-first, mobile-first responsive design
- **Bundle:** Purged in production for minimal file size
- **Customization:** CSS custom properties for design tokens

### Content Management

- **CMS:** Decap CMS (formerly Netlify CMS)
- **Content Storage:** Git-based (Markdown/YAML in repository)
- **Authentication:** GitHub OAuth via custom Cloudflare Worker proxy
- **Markdown Parsing:** marked package

### Hosting and Deployment

- **Platform:** Cloudflare Pages (free tier)
- **CDN:** Cloudflare global edge network
- **Build Trigger:** GitHub Actions on push to main
- **SSL:** Automatic via Cloudflare
- **OAuth Proxy:** Cloudflare Worker (free tier)

### Version Control and CI/CD

- **Repository:** GitHub (supports private repos)
- **CI/CD:** GitHub Actions
- **Deployment Method:** Wrangler CLI direct upload to Cloudflare Pages

## Architecture Decisions

### Why Cloudflare Worker for OAuth

Netlify's free OAuth proxy does not work with private GitHub repositories. A custom Cloudflare Worker implements the proper OAuth handshake protocol:

1. CMS opens popup window to `/auth`
2. Worker redirects to GitHub OAuth authorization
3. GitHub redirects back with authorization code
4. Worker exchanges code for access token
5. Worker sends token to parent window via postMessage
6. CMS receives token and completes authentication

This runs entirely on Cloudflare's free tier with no cold start issues.

### Why GitHub Actions Instead of Cloudflare Git Integration

Cloudflare Pages projects created via direct upload (`wrangler pages deploy`) do not have automatic Git integration. GitHub Actions provides:

- Automatic builds on push to main
- Full control over build environment
- Ability to run tests before deployment
- Works with any Git provider

### Why fs.readdirSync in getStaticPaths

Astro's `import.meta.glob` does not work inside `getStaticPaths()` for dynamic routes. Using Node's `fs.readdirSync` to read the content directory at build time is the reliable solution for CMS-managed dynamic pages.

### Why Dual Path Alias Configuration

Path aliases like `@/components` require configuration in both:

- `tsconfig.json` - For TypeScript/IDE support
- `astro.config.mjs` vite.resolve.alias - For actual build resolution

Missing either causes confusing errors where imports work in the editor but fail at build time, or vice versa.

## Constraints

### Cloudflare Free Tier Limits

- 500 builds per month (GitHub Actions handles builds, so this is Cloudflare deployments)
- Unlimited bandwidth
- 1 concurrent build
- Workers: 100,000 requests/day (more than sufficient for OAuth)

### Performance Requirements

- Zero JavaScript by default (Astro static rendering)
- Use Astro islands only when interactivity is essential
- All images optimized via `astro:assets`
- Target less than 100KB initial page load

### No Backend

- Purely static site output
- No server-side rendering (SSR)
- No API routes (except OAuth worker which is separate)
- No database connections

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Progressive enhancement for older browsers

## Development Standards

### TypeScript

- Strict mode enabled
- Explicit types for function parameters and return values
- Interfaces for object shapes, types for unions/intersections

### Naming Conventions

- **Files:** kebab-case (`event-card.astro`, `content-utils.ts`)
- **Components:** PascalCase (`EventCard.astro`, `Header.astro`)
- **Functions:** camelCase (`getPageContent`, `formatDate`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_ITEMS_PER_PAGE`)
- **Types/Interfaces:** PascalCase (`PageContent`, `SiteConfig`)

### Git Conventions

- `main` - Production (deploys to Cloudflare)
- Feature branches: `feature/add-feature-name`
- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
