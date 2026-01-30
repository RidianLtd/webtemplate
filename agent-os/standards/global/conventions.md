# Project Conventions

## Directory Structure

```
project/
├── public/              # Static assets (copied as-is)
│   ├── admin/           # Decap CMS admin panel
│   ├── uploads/         # CMS media uploads
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route-based pages
│   ├── content/         # CMS-managed content
│   │   ├── homepage/    # Homepage content (JSON)
│   │   ├── pages/       # Dynamic pages (Markdown)
│   │   └── settings/    # Site settings (JSON)
│   ├── styles/          # Global styles
│   └── utils/           # Helper functions
├── oauth-worker/        # Cloudflare Worker for OAuth
├── docs/                # Documentation
└── agent-os/            # Agent OS configuration
    └── standards/       # Coding standards
```

## Content Organization

### Collections

- `src/content/settings/` - Site configuration
- `src/content/homepage/` - Homepage content
- `src/content/pages/` - Dynamic page content

### Naming Content Files

- Use kebab-case: `about-us.md`
- Include date prefix for time-sensitive content: `2025-03-15-spring-update.md`
- Use descriptive, URL-friendly names

## Component Categories

### Layouts (`src/layouts/`)

- `BaseLayout.astro` - HTML document structure, head tags

### UI Components (`src/components/`)

- **Navigation:** `Header.astro`, `Footer.astro`
- **Content:** Section components as needed

## Page Routes

| Route | Page | Content Source |
|-------|------|----------------|
| `/` | Home | `src/content/homepage/content.json` |
| `/[slug]` | Dynamic pages | `src/content/pages/*.md` |
| `/admin` | CMS Admin | `public/admin/index.html` |

## Git Conventions

### Branches

- `main` - Production (deploys to Cloudflare)
- Feature branches: `feature/add-blog`

### Commits

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Keep commits focused and atomic
