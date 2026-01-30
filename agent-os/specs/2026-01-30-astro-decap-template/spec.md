# Specification: Astro + Decap CMS + Cloudflare Pages Template

## Goal

Create a production-ready template repository for static sites using Astro 5.x, Decap CMS with GitHub OAuth, and Cloudflare Pages deployment, encapsulating learnings and best practices from the Ridian website build.

## User Stories

- As a developer, I want to clone a template and have a working Astro + Decap CMS site deployed to Cloudflare Pages within an hour so that I can focus on customizing content and branding rather than infrastructure setup.
- As a content editor, I want to log in to the CMS at `/admin` and edit website content so that I can update the site without touching code.

## Specific Requirements

**OAuth Worker for Private Repository Authentication**

- Implement a Cloudflare Worker that handles the complete GitHub OAuth handshake flow
- The worker must respond to `/auth` (redirect to GitHub) and `/callback` (token exchange)
- Use `postMessage` protocol to communicate the token back to Decap CMS (the CMS expects `authorizing:github` followed by `authorization:github:success:` message format)
- Store GITHUB_CLIENT_ID in wrangler.toml vars, GITHUB_CLIENT_SECRET as a Cloudflare secret
- Include error handling with user-friendly error page display
- This is required because Netlify's OAuth proxy only works with public repos; private repos need custom OAuth

**GitHub Actions Deployment Workflow**

- Create a workflow that triggers on push to main/master branch
- Use `cloudflare/wrangler-action@v3` for deployment
- Required secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
- Build command: `npm run build`, output directory: `dist`
- This is required because Cloudflare Pages direct upload projects lack Git integration for automatic deploys

**Dynamic Page Routing with fs.readdirSync**

- Use `fs.readdirSync` in `getStaticPaths()` to read CMS-managed markdown files
- Parse frontmatter manually using regex (pattern: `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`)
- Use `marked` package to convert markdown body to HTML
- This is required because `import.meta.glob` does not work inside `getStaticPaths()` for dynamic content

**Dual Path Alias Configuration**

- Configure path aliases in `tsconfig.json` under `compilerOptions.paths` for TypeScript resolution
- Also configure in `astro.config.mjs` under `vite.resolve.alias` for build-time resolution
- Standard aliases: `@/components/*`, `@/layouts/*`, `@/content/*`, `@/utils/*`
- This is required because TypeScript and Vite have separate resolution systems

**Generic Homepage Structure**

- Hero section: CMS-editable headline, subheadline, and CTA button
- Features grid: List of CMS-editable feature cards (icon, title, description)
- Call-to-action section: CMS-editable heading and button
- Use Tailwind CSS with CSS custom properties for theming
- Zero JavaScript by default; use Astro islands only if interactivity required

**CMS Configuration with Three Collections**

- `settings` collection: Site title, tagline, navigation items (file-based, single JSON)
- `homepage` collection: Hero content, features list, CTA content (file-based, single JSON)
- `pages` collection: Dynamic pages with title, slug, body markdown (folder-based, multiple files)
- Enable `local_backend: true` for development mode (requires `npx decap-server`)
- Configure `base_url` and `auth_endpoint` pointing to the OAuth worker

**Placeholder Brand Identity with CSS Custom Properties**

- Define CSS variables: `--color-primary`, `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`
- Extend Tailwind colors to reference CSS variables for consistent theming
- Provide a neutral, professional color palette as starting point (not grayscale)
- Include documentation on how to customize the brand identity

**BaseLayout Component with Essential Meta Tags**

- Props: `title` (required), `description` (optional with default)
- Include viewport, charset, description meta tags
- Include Open Graph and Twitter Card meta tags for social sharing
- Load fonts via Google Fonts with `font-display: swap`
- Apply global styles: body background, font family, antialiasing

## Visual Design

No visual assets provided. The template uses a generic, customizable design system.

## Existing Code to Leverage

**OAuth Worker (`/Users/tomscrace/ridianweb/oauth-worker/index.js`)**

- Complete implementation of GitHub OAuth flow for Decap CMS
- Handles CORS preflight, `/auth` redirect, `/callback` token exchange
- Uses `postMessage` handshake protocol that Decap CMS expects
- Copy directly but genericize branding in the success/error HTML pages

**Dynamic Page Routing (`/Users/tomscrace/ridianweb/src/pages/[...slug].astro`)**

- Pattern for reading markdown files with `fs.readdirSync` in `getStaticPaths()`
- Frontmatter parsing regex and YAML extraction logic
- Integration with `marked` for markdown-to-HTML conversion
- Simplify the template by removing Ridian-specific UI elements

**CMS Configuration (`/Users/tomscrace/ridianweb/public/admin/config.yml`)**

- Backend configuration pattern with `base_url` and `auth_endpoint`
- Collection structure for settings, homepage, and pages
- Field definitions with widgets, validation patterns, and hints
- Simplify collections to generic homepage structure

**GitHub Actions Workflow (`/Users/tomscrace/ridianweb/.github/workflows/deploy.yml`)**

- Complete workflow using `cloudflare/wrangler-action@v3`
- Correct secrets configuration for CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
- Node 20 setup with npm caching
- Copy directly, changing only the project name placeholder

**Path Alias Configuration (`/Users/tomscrace/ridianweb/tsconfig.json` + `astro.config.mjs`)**

- Pattern for configuring aliases in both TypeScript and Vite
- tsconfig: `baseUrl` + `paths` object
- astro.config: `vite.resolve.alias` object
- Copy pattern directly to ensure both IDE and build resolution work

## Out of Scope

- Server-side rendering (SSR) or API routes (static output only)
- Database integration or external data sources
- User authentication beyond CMS access (no member areas)
- E-commerce functionality (no shopping cart, payments)
- Internationalization (i18n) or multi-language support
- Blog/posts collection (document how to add, but do not include)
- Ridian-specific design elements (quote carousel, meridian line, solution cards)
- Complex interactive components requiring client-side JavaScript
- Image optimization beyond Astro's built-in `astro:assets`
- Preview deployments for pull requests (manual setup documented only)
