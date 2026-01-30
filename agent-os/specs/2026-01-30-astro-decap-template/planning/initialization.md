# Spec Initialization

## Spec Name
Astro + Decap CMS + Cloudflare Pages Template

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

### Source Reference
Patterns to be extracted from: `/Users/tomscrace/ridianweb`
