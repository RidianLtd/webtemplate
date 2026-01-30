# Architecture

This document explains the technical decisions behind the template and why certain approaches were chosen.

## System Overview

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|  Content Editor   |---->|   Decap CMS UI    |---->|  GitHub Repo      |
|  (Browser)        |     |   (/admin)        |     |  (Content)        |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
                                  |                         |
                                  v                         v
                          +-------------------+     +-------------------+
                          |                   |     |                   |
                          |  OAuth Worker     |     |  GitHub Actions   |
                          |  (Cloudflare)     |     |  (CI/CD)          |
                          |                   |     |                   |
                          +-------------------+     +-------------------+
                                                            |
                                                            v
                                                    +-------------------+
                                                    |                   |
                                                    |  Cloudflare Pages |
                                                    |  (Static Site)    |
                                                    |                   |
                                                    +-------------------+
                                                            |
                                                            v
                                                    +-------------------+
                                                    |                   |
                                                    |  Website Visitor  |
                                                    |  (Browser)        |
                                                    |                   |
                                                    +-------------------+
```

## Key Technical Decisions

### Why a Custom OAuth Worker?

**Problem:** Decap CMS supports GitHub authentication out of the box, but Netlify's built-in OAuth proxy only works with public repositories. For private repositories, you need a custom OAuth handler.

**Solution:** A Cloudflare Worker handles the complete OAuth flow:

1. Redirects users to GitHub's authorization page
2. Receives the callback with an authorization code
3. Exchanges the code for an access token
4. Sends the token back to Decap CMS via `postMessage`

**Why Cloudflare Workers?**

- Free tier covers typical CMS usage
- Same platform as the hosting (simpler management)
- Edge deployment means low latency globally
- No server to maintain

**The postMessage Protocol:**

Decap CMS uses a specific handshake protocol:

```
1. CMS opens popup to /auth
2. Worker redirects to GitHub
3. User authorizes
4. GitHub redirects to /callback
5. Worker exchanges code for token
6. Popup sends "authorizing:github" to opener
7. CMS responds, popup sends "authorization:github:success:{token}"
8. Popup closes
```

### Why GitHub Actions for Deployment?

**Problem:** Cloudflare Pages offers direct GitHub integration, but only for repositories connected during project creation. "Direct upload" projects (created without Git integration) cannot be retroactively connected.

**Why use direct upload projects?**

- More control over build process
- Can use GitHub Actions secrets for sensitive configuration
- Consistent deployment process across environments

**Solution:** GitHub Actions workflow that:

1. Triggers on push to main branch
2. Builds the Astro site
3. Deploys to Cloudflare Pages using `wrangler pages deploy`

This gives full control while maintaining automatic deployments.

### Why fs.readdirSync Instead of import.meta.glob?

**Problem:** Astro's `import.meta.glob` is the standard way to read multiple files. However, it does not work inside `getStaticPaths()` for dynamic routes.

**Technical reason:** `import.meta.glob` is processed at compile time before `getStaticPaths()` runs. When used inside `getStaticPaths()`, the glob patterns are not resolved correctly.

**Solution:** Use Node.js `fs.readdirSync` to read markdown files:

```typescript
export async function getStaticPaths() {
  const pagesDir = path.join(process.cwd(), 'src/content/pages')
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'))

  // Parse each file and return paths
  return files.map(file => ({
    params: { slug: parseSlug(file) },
    props: parseContent(file)
  }))
}
```

**Trade-offs:**

- Less elegant than glob patterns
- Requires manual frontmatter parsing
- But: Works reliably in all Astro contexts

### Why Dual Path Alias Configuration?

**Problem:** Path aliases like `@/components` need to work in both:
1. TypeScript/IDE - for autocomplete and type checking
2. Vite/Astro - for build-time resolution

These are separate systems with separate configurations.

**Solution:** Configure aliases in two places:

**tsconfig.json** (for TypeScript):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"]
    }
  }
}
```

**astro.config.mjs** (for Vite):
```javascript
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@/components': '/src/components',
        '@/layouts': '/src/layouts'
      }
    }
  }
})
```

Both must be kept in sync manually.

### Why CSS Custom Properties for Theming?

**Problem:** Need to support easy brand customization without requiring users to understand Tailwind configuration.

**Solution:** CSS custom properties (CSS variables) in `src/styles/global.css`:

```css
:root {
  --color-primary: #3B82F6;
  --color-background: #0F172A;
  --color-text: #F8FAFC;
}
```

Tailwind references these variables:

```css
@theme {
  --color-primary: var(--color-primary);
  --color-background: var(--color-background);
}
```

**Benefits:**

- Change colors in one place (`global.css`)
- No Tailwind config knowledge required
- CSS variables work everywhere (Tailwind classes, custom CSS, inline styles)
- Potential for runtime theme switching

## Data Flow

### Content Editing Flow

```
1. Editor logs into /admin
2. OAuth worker authenticates with GitHub
3. Editor modifies content
4. Decap CMS commits changes to GitHub
5. GitHub triggers Actions workflow
6. Astro builds site
7. Cloudflare Pages deploys
8. Changes live in ~2 minutes
```

### Page Generation Flow

```
1. Astro build starts
2. index.astro reads JSON content files
3. [...slug].astro:
   a. getStaticPaths() reads all .md files
   b. Parses frontmatter
   c. Returns path for each page
4. For each path:
   a. Astro renders the page
   b. Markdown converted to HTML via `marked`
   c. HTML written to dist/
5. Static files deployed to edge
```

### OAuth Flow

```
Browser                  Worker                   GitHub
   |                        |                        |
   |------ GET /auth ------>|                        |
   |                        |--- Redirect ---------->|
   |                        |                        |
   |<---------------- Authorization Page ------------|
   |                        |                        |
   |--------------- User Grants Access ------------>|
   |                        |                        |
   |                        |<-- Callback + Code ----|
   |                        |                        |
   |                        |--- Exchange Code ----->|
   |                        |<-- Access Token -------|
   |                        |                        |
   |<-- postMessage Token --|                        |
   |                        |                        |
```

## File Structure Rationale

```
src/
├── components/     # Reusable UI pieces
├── content/        # CMS-managed data
│   ├── homepage/   # Single JSON file (file-based collection)
│   ├── pages/      # Multiple MD files (folder-based collection)
│   └── settings/   # Site configuration (file-based)
├── layouts/        # HTML document structure
├── pages/          # Route-based (maps to URLs)
└── styles/         # Global CSS and tokens
```

**Why separate layouts and pages?**

- **Layouts** define the HTML document structure (head, body wrapper)
- **Pages** define route content (what goes in the body)
- Allows reusing layouts across multiple pages
- Clear separation of concerns

**Why JSON for homepage/settings, Markdown for pages?**

- **JSON:** Structured data with nested objects (hero, features, CTA)
- **Markdown:** Long-form content with formatting

## Performance Considerations

### Zero JavaScript by Default

Astro ships no JavaScript unless explicitly added. This template:

- Uses no `client:*` directives
- All interactivity is CSS-based
- Result: Fast initial load, no hydration delay

### Static Generation

All pages are pre-rendered at build time:

- No server-side rendering (SSR)
- Content served directly from CDN
- Pages load in milliseconds

### Edge Deployment

Cloudflare Pages serves from 300+ global locations:

- Automatic geographic routing
- Built-in compression (Brotli)
- HTTP/3 support

## Security Considerations

### OAuth Secret Storage

- **Client ID:** Can be public (in wrangler.toml)
- **Client Secret:** Must be stored as Cloudflare secret
- Never committed to repository

### CMS Access Control

- Only users with GitHub repository access can edit
- OAuth scopes limited to `repo,user`
- No anonymous editing

### Static Site Security

- No server-side code to exploit
- No database to breach
- Attack surface limited to DNS/CDN
