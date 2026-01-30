# Product Roadmap

1. [ ] Astro Project Foundation — Initialize Astro 5.x project with TypeScript strict mode, configure path aliases in both tsconfig.json and astro.config.mjs vite.resolve.alias, and set up basic project structure (src/pages, src/components, src/layouts, src/content, src/utils). `S`

2. [ ] Tailwind CSS Integration — Install and configure Tailwind CSS with a customizable design token system using CSS custom properties, mobile-first responsive utilities, and production purging. `XS`

3. [ ] Base Layout and Components — Create BaseLayout.astro (HTML document structure, head tags, meta) and PageLayout.astro (header, footer, main content slot) with placeholder navigation. `S`

4. [ ] Homepage Content Collection — Set up Astro content collection for homepage data (hero section, features list, CTA) with TypeScript schema validation and a sample homepage markdown file. `S`

5. [ ] Homepage Rendering — Build the homepage (src/pages/index.astro) that reads from the homepage content collection and renders editable sections using the marked package for markdown-to-HTML conversion. `S`

6. [ ] Dynamic Pages Collection — Implement pages content collection with [...slug].astro catch-all route using fs.readdirSync in getStaticPaths() for CMS-managed dynamic pages. `M`

7. [ ] Decap CMS Admin Setup — Configure public/admin/index.html and public/admin/config.yml with GitHub backend, homepage collection widget definitions, and pages collection for dynamic content. `S`

8. [ ] Cloudflare Worker OAuth Proxy — Create the OAuth worker implementing the complete GitHub OAuth handshake protocol: popup sends "authorizing:github", waits for CMS response, exchanges code for token, sends token back to parent window. `M`

9. [ ] GitHub Actions Deployment Workflow — Create .github/workflows/deploy.yml that builds the Astro site and deploys to Cloudflare Pages using wrangler on push to main branch. `S`

10. [ ] Environment Configuration — Document all required environment variables (GitHub OAuth client ID/secret, Cloudflare API token, account ID, project name) with .env.example template file. `XS`

11. [ ] Setup Documentation — Write comprehensive README.md with step-by-step instructions: creating GitHub OAuth app, deploying the Cloudflare Worker, configuring Cloudflare Pages project, setting GitHub Actions secrets. `M`

12. [ ] Agent-OS Standards — Copy and adapt relevant standards from ridianweb (coding-style.md, conventions.md, tech-stack.md) to provide consistent development guidelines for template users. `S`

> Notes
>
> - Order reflects technical dependencies: foundation first, then content system, then CMS, then deployment
> - Each item is end-to-end testable: can verify the feature works in isolation
> - OAuth worker (item 8) is the most technically complex piece and the key differentiator
> - Documentation (items 10-12) is critical for template usability
