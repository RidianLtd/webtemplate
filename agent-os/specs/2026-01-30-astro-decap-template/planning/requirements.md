# Spec Requirements: Astro + Decap CMS + Cloudflare Pages Template

## Initial Description

Create a production-ready template repository for Astro + Decap CMS + Cloudflare Pages websites. This template should encapsulate learnings from the Ridian website build at /Users/tomscrace/ridianweb.

### Key Learnings to Incorporate

1. **OAuth Worker for Decap CMS** - Netlify's free tier OAuth doesn't work with private GitHub repos. Need a custom Cloudflare Worker implementing the complete OAuth handshake protocol.

2. **GitHub Actions for auto-deployment** - Direct upload Cloudflare Pages projects lack Git integration, so GitHub Actions workflow is required to deploy via wrangler.

3. **Dynamic page routing** - Use `fs.readdirSync` in `getStaticPaths()` because `import.meta.glob` doesn't work there for CMS-managed dynamic pages.

4. **Dual path alias configuration** - Path aliases need configuration in both `tsconfig.json` AND `astro.config.mjs` vite.resolve.alias for proper TypeScript and build resolution.

5. **Markdown parsing** - Use `marked` package for rendering CMS markdown content to HTML.

### Production-Ready Requirements

The template should be production-ready, requiring only:
- GitHub repo setup
- Cloudflare account/API token
- Content customization

## Requirements Discussion

### First Round Questions

**Q1:** The Ridian site has a fairly specific homepage structure (quote carousel, landscape section, solution cards, contact CTA). I'm assuming the template should include a simpler, more generic homepage structure - perhaps hero section, features grid, and CTA - that's easier to customize for different use cases. Is that correct, or should we keep the Ridian-style sections as a more opinionated starting point?

**Answer:** Generic homepage (hero, features grid, CTA) - NOT the Ridian-style sections

**Q2:** I'm thinking the template should strip out Ridian-specific brand colors (Midnight Void, Meridian Cyan) and provide a neutral, easily customizable color palette with CSS custom properties and clear naming (e.g., `--color-primary`, `--color-background`). Should we include a "placeholder" brand identity, or start with a more minimal grayscale that forces customization?

**Answer:** Start with a placeholder brand identity and include documentation about customizing it

**Q3:** The Ridian config has `settings`, `homepage`, and `pages` collections. I assume the template should include all three as a solid starting point. Should we also include a `blog` or `posts` collection since that's a common use case, or keep it minimal and document how to add one?

**Answer:** Keep it minimal (settings, homepage, pages) and document how to add blog/posts

**Q4:** The OAuth worker is currently in a separate `oauth-worker/` directory with its own wrangler.toml. I'm assuming we should keep this structure and document manual deployment (via `wrangler deploy`) as a one-time setup step. Or should we investigate integrating it into the GitHub Actions workflow for fully automated deployment?

**Answer:** Keep it how it is - separate oauth-worker/ directory with manual deployment as one-time setup

**Q5:** Given that a key differentiator is "documentation that explains why," I'm planning for comprehensive README.md covering: (a) full setup walkthrough, (b) architecture decisions, (c) common customization guides. Should we also include separate docs for advanced topics (e.g., `docs/oauth-troubleshooting.md`, `docs/adding-collections.md`), or keep everything in a single README?

**Answer:** Split into separate docs (not all in one README)

**Q6:** The roadmap mentions copying relevant standards from Ridian. Should the template include the full `agent-os/standards/` directory structure as development guidelines for template users, or is that overkill for a template repository?

**Answer:** Include full standards directory

**Q7:** What should be explicitly OUT of scope? I'm assuming we're NOT including: SSR/API routes, database integration, user authentication beyond CMS access, e-commerce functionality, or internationalization. Are there other features you want to explicitly exclude, or any of these you actually want included?

**Answer:** Confirmed - NO SSR/API routes, database, user auth beyond CMS, e-commerce, i18n

### Existing Code to Reference

**Similar Features Identified:**

- Feature: Ridian Website - Path: `/Users/tomscrace/ridianweb`
- Components to potentially reuse: BaseLayout.astro, Header.astro, Footer.astro (simplified/genericized)
- Backend logic to reference: OAuth worker implementation at `oauth-worker/`
- Configuration patterns: `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- CMS configuration: `public/admin/config.yml`, `public/admin/index.html`
- GitHub Actions: `.github/workflows/` deployment workflow
- Dynamic routing: Page routing pattern using `fs.readdirSync` in `getStaticPaths()`

### Follow-up Questions

No follow-up questions were needed.

## Visual Assets

### Files Provided:

No visual assets provided.

### Visual Insights:

Not applicable - no visual assets to analyze.

## Requirements Summary

### Functional Requirements

- **Static Site Generation:** Astro 5.x with static output only
- **Content Management:** Decap CMS with Git-based storage (Markdown/YAML)
- **Authentication:** GitHub OAuth via custom Cloudflare Worker proxy
- **Deployment:** Cloudflare Pages via GitHub Actions workflow
- **Styling:** Tailwind CSS with customizable design tokens

#### Homepage Structure
- Hero section (CMS-editable headline, subheadline, CTA button)
- Features grid (CMS-editable feature cards)
- Call-to-action section (CMS-editable)

#### CMS Collections
- `settings` - Global site settings (site name, navigation, footer)
- `homepage` - Homepage content sections
- `pages` - Dynamic pages with markdown content

#### OAuth Worker
- Separate `oauth-worker/` directory
- Complete OAuth handshake implementation for GitHub
- Works with private repositories
- One-time manual deployment via wrangler

#### GitHub Actions Workflow
- Automatic build on push to main
- Deploy to Cloudflare Pages via wrangler CLI
- Required secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

### Documentation Structure

Split documentation into multiple files:

- `README.md` - Quick start, overview, links to other docs
- `docs/setup-guide.md` - Complete step-by-step setup walkthrough
- `docs/architecture.md` - Architecture decisions and "why" explanations
- `docs/customization.md` - How to customize branding, colors, typography
- `docs/adding-collections.md` - Guide to adding blog/posts or other CMS collections
- `docs/oauth-troubleshooting.md` - Common OAuth issues and solutions
- `docs/deployment.md` - Cloudflare and GitHub Actions configuration

### Design Token / Theming Approach

- Placeholder brand identity (not grayscale, but generic/professional)
- CSS custom properties for easy customization
- Clear naming convention (e.g., `--color-primary`, `--color-background`, `--color-text`)
- Tailwind configuration with extended colors referencing CSS variables
- Documentation explaining how to customize the brand identity

### Standards Directory

Include full `agent-os/standards/` directory structure:
- `global/` - Coding style, conventions, tech stack
- `frontend/` - Astro patterns, CSS, components, accessibility, responsive design
- `content/` - CMS structure
- `deployment/` - Cloudflare configuration

### Reusability Opportunities

- BaseLayout.astro pattern (stripped of Ridian-specific branding)
- Header/Footer component structure (simplified)
- Tailwind config structure with design tokens
- Path alias configuration (dual tsconfig + vite)
- Dynamic page routing with fs.readdirSync
- GitHub Actions deployment workflow
- OAuth worker implementation (copy directly)
- Decap CMS admin configuration pattern

### Scope Boundaries

**In Scope:**

- Astro 5.x static site framework
- Tailwind CSS styling with design tokens
- Decap CMS integration with GitHub backend
- OAuth Cloudflare Worker for private repo authentication
- GitHub Actions deployment workflow
- Generic homepage (hero, features, CTA)
- Dynamic pages collection
- Global settings collection
- Comprehensive split documentation
- Full agent-os/standards directory
- Placeholder brand identity with customization guide

**Out of Scope:**

- Server-side rendering (SSR)
- API routes
- Database integration
- User authentication beyond CMS access
- E-commerce functionality
- Internationalization (i18n)
- Blog/posts collection (documented how to add)
- Ridian-specific design patterns (quote carousel, landscape section, solution cards)
- Complex interactive components (Astro islands kept minimal)

### Technical Considerations

- **Path Aliases:** Must configure in both `tsconfig.json` AND `astro.config.mjs` vite.resolve.alias
- **Dynamic Routes:** Use `fs.readdirSync` in `getStaticPaths()` - `import.meta.glob` does not work
- **Markdown Parsing:** Use `marked` package for rendering CMS markdown content
- **OAuth Flow:** Worker handles complete handshake (auth redirect -> code exchange -> token delivery via postMessage)
- **Cloudflare Free Tier:** 500 deployments/month, 100k worker requests/day
- **Zero JavaScript Default:** Use Astro islands only when absolutely necessary
- **Performance Target:** Less than 100KB initial page load
