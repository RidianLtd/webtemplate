# Task Breakdown: Astro + Decap CMS + Cloudflare Pages Template

## Overview

Total Tasks: 31 (across 5 task groups)

This task breakdown creates a production-ready template repository that encapsulates learnings from the Ridian website build. Tasks are ordered so that each group builds upon the previous, with documentation coming last after all functionality is verified.

## Task List

### Foundation Layer

#### Task Group 1: Astro Project Setup and Configuration

**Dependencies:** None

- [x] 1.0 Complete Astro project foundation
  - [x] 1.1 Initialize Astro 5.x project with TypeScript
    - Run `npm create astro@latest` with TypeScript strict mode
    - Select empty project template (no starter content)
    - Project name: `astro-decap-template`
  - [x] 1.2 Install and configure Tailwind CSS
    - Run `npx astro add tailwind`
    - Create `tailwind.config.mjs` with CSS variable-based color system
    - Reference pattern: `/Users/tomscrace/ridianweb/tailwind.config.mjs`
    - Replace Ridian-specific colors with generic CSS variables:
      ```javascript
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
      }
      ```
  - [x] 1.3 Configure path aliases in tsconfig.json
    - Reference: `/Users/tomscrace/ridianweb/tsconfig.json`
    - Add `baseUrl: "."` and `paths` object for `@/components/*`, `@/layouts/*`, `@/content/*`, `@/utils/*`
  - [x] 1.4 Configure path aliases in astro.config.mjs
    - Reference: `/Users/tomscrace/ridianweb/astro.config.mjs`
    - Add `vite.resolve.alias` configuration matching tsconfig paths
    - Set `output: 'static'` explicitly
    - Add placeholder `site` URL
  - [x] 1.5 Create global CSS with design tokens
    - Create `src/styles/global.css`
    - Define CSS custom properties:
      ```css
      :root {
        --color-primary: #3B82F6;      /* Blue - customize per brand */
        --color-background: #0F172A;   /* Dark slate background */
        --color-surface: #1E293B;      /* Elevated surface */
        --color-text: #F8FAFC;         /* Primary text */
        --color-text-muted: #94A3B8;   /* Secondary text */
      }
      ```
    - Include font imports and base styles
  - [x] 1.6 Create BaseLayout component
    - Reference: `/Users/tomscrace/ridianweb/src/layouts/BaseLayout.astro`
    - Props: `title` (required), `description` (optional with default)
    - Include viewport, charset, description meta tags
    - Include Open Graph and Twitter Card meta tags with placeholders
    - Load fonts via Google Fonts (use Inter as default body font)
    - Apply global styles: body background, font family, antialiasing
    - Remove Ridian-specific elements (infrastructure grid, brand colors)
  - [x] 1.7 Create project structure directories
    - `src/components/` - Reusable UI components
    - `src/layouts/` - Page layouts
    - `src/content/settings/` - Site settings JSON
    - `src/content/homepage/` - Homepage content JSON
    - `src/content/pages/` - Dynamic page markdown files
    - `public/admin/` - Decap CMS admin interface
    - `public/uploads/` - CMS media uploads
  - [x] 1.8 Verify Astro build works
    - Run `npm run build` to ensure static output generates
    - Run `npm run dev` to verify development server starts
    - Confirm path aliases resolve correctly

**Acceptance Criteria:**

- `npm run dev` starts development server without errors
- `npm run build` generates static output in `dist/`
- Path aliases (`@/components/*`, etc.) resolve correctly in IDE and build
- CSS custom properties are applied globally
- BaseLayout renders with correct meta tags

---

### CMS Layer

#### Task Group 2: Decap CMS Configuration

**Dependencies:** Task Group 1

- [x] 2.0 Complete Decap CMS integration
  - [x] 2.1 Create CMS admin HTML page
    - Create `public/admin/index.html`
    - Reference: `/Users/tomscrace/ridianweb/public/admin/index.html`
    - Genericize branding (remove Ridian-specific styles)
    - Keep login page styling with CSS variables
    - Load Decap CMS from CDN
  - [x] 2.2 Create CMS configuration file
    - Create `public/admin/config.yml`
    - Reference: `/Users/tomscrace/ridianweb/public/admin/config.yml`
    - Configure backend with placeholders:
      ```yaml
      backend:
        name: github
        repo: YOUR_USERNAME/YOUR_REPO
        branch: main
        base_url: https://YOUR_OAUTH_WORKER.workers.dev
        auth_endpoint: /auth
      local_backend: true
      ```
  - [x] 2.3 Configure settings collection
    - File-based collection at `src/content/settings/general.json`
    - Fields: site_title, tagline, default_description
    - Create initial `general.json` with placeholder values
  - [x] 2.4 Configure homepage collection
    - File-based collection at `src/content/homepage/content.json`
    - Fields structure:
      - `hero` object: headline, subheadline, cta_text, cta_link
      - `features` list: title, description, icon (emoji or text placeholder)
      - `cta` object: heading, description, button_text, button_link
    - Create initial `content.json` with placeholder content
  - [x] 2.5 Configure pages collection
    - Folder-based collection at `src/content/pages/`
    - Fields: title, slug (with pattern validation), body (markdown)
    - Create sample page `about.md` with frontmatter
  - [x] 2.6 Test local CMS backend
    - Run `npx decap-server` in separate terminal
    - Navigate to `/admin` in development server
    - Verify collections appear and content loads
    - Test editing and saving content locally

**Acceptance Criteria:**

- CMS admin page loads at `/admin`
- Local backend works with `npx decap-server`
- All three collections (settings, homepage, pages) are visible
- Content edits save to local files correctly
- File structure matches `config.yml` paths

---

#### Task Group 3: Homepage and Dynamic Pages

**Dependencies:** Task Group 2

- [x] 3.0 Complete frontend page templates
  - [x] 3.1 Install marked package for markdown rendering
    - Run `npm install marked`
    - Package used for converting CMS markdown to HTML
  - [x] 3.2 Create homepage reading CMS content
    - Create `src/pages/index.astro`
    - Read `src/content/homepage/content.json` using `fs.readFileSync`
    - Read `src/content/settings/general.json` for site title
    - Structure homepage with:
      - Hero section (headline, subheadline, CTA button)
      - Features grid (3-4 feature cards in responsive grid)
      - Call-to-action section (heading, description, button)
  - [x] 3.3 Style homepage with Tailwind
    - Use CSS variable-based colors via Tailwind config
    - Hero: centered text, large headline, prominent CTA button
    - Features: responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
    - CTA: contrasting background section
    - Ensure zero JavaScript by default
  - [x] 3.4 Create dynamic page template with fs.readdirSync
    - Create `src/pages/[...slug].astro`
    - Reference: `/Users/tomscrace/ridianweb/src/pages/[...slug].astro`
    - Use `fs.readdirSync` in `getStaticPaths()` to read markdown files
    - Parse frontmatter with regex: `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`
    - Convert markdown body to HTML with `marked`
    - Simplify template (remove Ridian-specific UI elements)
  - [x] 3.5 Create Header component
    - Create `src/components/Header.astro`
    - Site title/logo linking to home
    - Navigation links (can be hardcoded initially, document how to make dynamic)
    - Responsive design with mobile-friendly layout
  - [x] 3.6 Create Footer component
    - Create `src/components/Footer.astro`
    - Copyright text with current year
    - Optional tagline from settings
    - Minimal, clean design
  - [x] 3.7 Verify page rendering
    - Homepage renders with CMS content
    - Dynamic pages render at correct URLs
    - All links work correctly
    - Responsive design works across breakpoints

**Acceptance Criteria:**

- Homepage displays hero, features grid, and CTA from CMS content
- Dynamic pages render at `/[slug]` URLs
- Header and Footer components display on all pages
- Pages are fully responsive
- Zero client-side JavaScript (static HTML output)
- Build succeeds with `npm run build`

---

### Infrastructure Layer

#### Task Group 4: OAuth Worker and Deployment

**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete OAuth and deployment infrastructure
  - [x] 4.1 Create OAuth worker directory structure
    - Create `oauth-worker/` directory at project root
    - Create `oauth-worker/index.js`
    - Create `oauth-worker/wrangler.toml`
  - [x] 4.2 Implement OAuth worker
    - Copy from: `/Users/tomscrace/ridianweb/oauth-worker/index.js`
    - Genericize the success/error HTML pages:
      - Remove Ridian branding colors (#020B19, #00E5FF)
      - Use neutral colors or CSS variables
      - Change default message from "Ridian OAuth Proxy" to generic
    - Keep all OAuth flow logic intact (CORS, /auth, /callback, postMessage)
  - [x] 4.3 Configure wrangler.toml
    - Reference: `/Users/tomscrace/ridianweb/oauth-worker/wrangler.toml`
    - Use placeholder values:
      ```toml
      name = "your-project-oauth"
      main = "index.js"
      compatibility_date = "2024-01-01"

      [vars]
      GITHUB_CLIENT_ID = "YOUR_CLIENT_ID"
      ```
    - Document that GITHUB_CLIENT_SECRET must be set via `wrangler secret`
  - [x] 4.4 Create GitHub Actions deployment workflow
    - Create `.github/workflows/deploy.yml`
    - Copy from: `/Users/tomscrace/ridianweb/.github/workflows/deploy.yml`
    - Replace `--project-name=ridian` with placeholder
    - Use main branch (not master) as default
    - Include comments explaining required secrets
  - [x] 4.5 Ensure package.json has correct scripts
    - Add `"build": "astro build"` (default from Astro)
    - Add `"dev": "astro dev"`
    - Add `"preview": "astro preview"`
    - Verify npm ci works for clean install
  - [x] 4.6 Create .nvmrc file
    - Specify Node 20 for consistency with GitHub Actions
  - [x] 4.7 Update .gitignore if needed
    - Include standard Astro ignores (dist/, node_modules/, .astro/)
    - Include `.env` and `.env.*` files
    - Include .DS_Store
  - [x] 4.8 Verify local OAuth worker structure
    - Worker files are in place with genericized branding

**Acceptance Criteria:**

- OAuth worker code is in place with genericized branding
- wrangler.toml has placeholder configuration
- GitHub Actions workflow is configured with correct steps
- All required scripts exist in package.json
- .gitignore excludes appropriate files

---

### Documentation Layer

#### Task Group 5: Documentation

**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete comprehensive documentation
  - [x] 5.1 Create README.md
    - Quick start section (5-minute overview)
    - Feature highlights
    - Links to detailed documentation
    - Prerequisites (Node 20, Cloudflare account, GitHub account)
    - Technology stack overview
  - [x] 5.2 Create docs/setup-guide.md
    - Step-by-step setup walkthrough:
      1. Clone/use template
      2. Install dependencies
      3. Create GitHub OAuth App (with screenshots path)
      4. Deploy OAuth worker
      5. Configure Decap CMS backend
      6. Set up Cloudflare Pages project
      7. Configure GitHub secrets
      8. First deployment
    - Include troubleshooting for common issues
  - [x] 5.3 Create docs/architecture.md
    - Explain "why" behind each decision:
      - Why OAuth worker (Netlify doesn't work with private repos)
      - Why GitHub Actions (direct upload lacks Git integration)
      - Why fs.readdirSync (import.meta.glob doesn't work in getStaticPaths)
      - Why dual path aliases (TypeScript and Vite separate systems)
    - Include architecture diagram (ASCII or description)
    - Data flow explanation
  - [x] 5.4 Create docs/customization.md
    - How to customize brand identity:
      - CSS custom properties in global.css
      - Tailwind config color mapping
      - Font selection and loading
    - How to modify homepage structure
    - How to add/remove sections
    - How to customize CMS login page styling
  - [x] 5.5 Create docs/adding-collections.md
    - Step-by-step guide to add a blog/posts collection
    - Example collection configuration
    - Example page template for listing posts
    - Example template for individual post pages
    - Explain folder vs file-based collections
  - [x] 5.6 Create docs/oauth-troubleshooting.md
    - Common errors and solutions:
      - "No opener window" error
      - Token exchange failures
      - CORS issues
      - Worker deployment problems
    - How to test OAuth flow
    - How to debug with browser console
    - How to check worker logs
  - [x] 5.7 Create docs/deployment.md
    - Detailed Cloudflare Pages setup
    - GitHub Actions secrets configuration
    - Environment variables reference
    - Manual vs automatic deployment options
    - Preview deployments (document as optional manual setup)
  - [x] 5.8 Copy and adapt standards directory
    - Copy `/Users/tomscrace/ridianweb/agent-os/standards/` structure
    - Adapt files to be generic (remove Ridian-specific references):
      - `global/tech-stack.md` - Keep Astro/Tailwind/Cloudflare stack
      - `global/coding-style.md` - Keep TypeScript conventions
      - `global/conventions.md` - Update for template structure
      - `frontend/astro.md` - Keep Astro patterns
      - `frontend/css.md` - Keep CSS best practices
      - `frontend/responsive.md` - Keep responsive guidelines
      - `content/cms-structure.md` - Update for template collections
      - `deployment/cloudflare.md` - Keep Cloudflare deployment info
    - Remove or stub files that are too Ridian-specific
  - [x] 5.9 Final review and verification
    - Read through all documentation for accuracy
    - Verify all file paths and code snippets are correct
    - Ensure documentation matches actual implementation
    - Test that a fresh clone + following setup guide works

**Acceptance Criteria:**

- README.md provides clear quick start
- Setup guide is comprehensive and follows logical order
- Architecture doc explains "why" not just "what"
- Customization guide enables brand identity changes
- Adding collections guide includes complete blog example
- OAuth troubleshooting covers common failure scenarios
- All documentation is accurate and up-to-date

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Astro Project Setup** - Foundation must come first
2. **Task Group 2: Decap CMS Configuration** - CMS depends on project structure
3. **Task Group 3: Homepage and Dynamic Pages** - Pages depend on CMS content
4. **Task Group 4: OAuth Worker and Deployment** - Infrastructure can be done in parallel with Task Group 3, but testing requires working pages
5. **Task Group 5: Documentation** - Must come last, after all features work

## Reference Files Summary

| Template File | Ridian Reference | Notes |
|---------------|------------------|-------|
| `oauth-worker/index.js` | `/Users/tomscrace/ridianweb/oauth-worker/index.js` | Genericize branding |
| `oauth-worker/wrangler.toml` | `/Users/tomscrace/ridianweb/oauth-worker/wrangler.toml` | Use placeholders |
| `src/pages/[...slug].astro` | `/Users/tomscrace/ridianweb/src/pages/[...slug].astro` | Remove Ridian UI |
| `public/admin/config.yml` | `/Users/tomscrace/ridianweb/public/admin/config.yml` | Simplify collections |
| `public/admin/index.html` | `/Users/tomscrace/ridianweb/public/admin/index.html` | Genericize branding |
| `.github/workflows/deploy.yml` | `/Users/tomscrace/ridianweb/.github/workflows/deploy.yml` | Use placeholders |
| `tsconfig.json` | `/Users/tomscrace/ridianweb/tsconfig.json` | Copy path alias pattern |
| `astro.config.mjs` | `/Users/tomscrace/ridianweb/astro.config.mjs` | Copy Vite alias pattern |
| `src/layouts/BaseLayout.astro` | `/Users/tomscrace/ridianweb/src/layouts/BaseLayout.astro` | Remove brand elements |
| `tailwind.config.mjs` | `/Users/tomscrace/ridianweb/tailwind.config.mjs` | Use CSS variables |
| `agent-os/standards/*` | `/Users/tomscrace/ridianweb/agent-os/standards/*` | Adapt for template |

## Key Technical Decisions

1. **CSS Variables over hardcoded colors**: Enables easy brand customization without modifying Tailwind config
2. **fs.readdirSync in getStaticPaths**: Required because import.meta.glob fails in this context
3. **Dual path alias configuration**: TypeScript and Vite have separate resolution systems
4. **postMessage OAuth handshake**: Required by Decap CMS for token delivery
5. **GitHub Actions over Cloudflare Git integration**: Direct upload projects lack automatic Git deployment
6. **local_backend: true**: Enables local CMS development without OAuth
