# Astro + Decap CMS + Cloudflare Pages Template

A production-ready template for static websites with visual content management. Built with modern tooling and optimized for performance.

## Quick Start (5 minutes)

```bash
# Clone the template
git clone https://github.com/YOUR_USERNAME/astro-decap-template.git my-site
cd my-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site. For CMS access during development, run `npx decap-server` in a separate terminal and visit `http://localhost:4321/admin`.

## Features

- **Astro 5.x** - Static site generation with zero JavaScript by default
- **Decap CMS** - Visual content editor for non-technical users
- **GitHub OAuth** - Secure authentication for private repositories
- **Cloudflare Pages** - Global edge deployment with automatic SSL
- **Tailwind CSS** - Utility-first styling with CSS custom properties for theming
- **TypeScript** - Type-safe development with strict mode

## Prerequisites

Before deploying, you will need:

- **Node.js 20+** - For local development
- **GitHub Account** - For repository hosting and OAuth
- **Cloudflare Account** - Free tier is sufficient for most sites

## Documentation

| Guide | Description |
|-------|-------------|
| [Setup Guide](docs/setup-guide.md) | Step-by-step deployment walkthrough |
| [Architecture](docs/architecture.md) | Technical decisions and data flow |
| [Customization](docs/customization.md) | Brand identity and styling |
| [Adding Collections](docs/adding-collections.md) | How to add a blog or other content types |
| [OAuth Troubleshooting](docs/oauth-troubleshooting.md) | Common authentication issues |
| [Deployment](docs/deployment.md) | Cloudflare Pages configuration |

## Project Structure

```
/
├── public/
│   └── admin/           # Decap CMS admin interface
├── src/
│   ├── components/      # Reusable UI components
│   ├── content/         # CMS-managed content
│   │   ├── homepage/    # Homepage content (JSON)
│   │   ├── pages/       # Dynamic pages (Markdown)
│   │   └── settings/    # Site settings (JSON)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route-based pages
│   └── styles/          # Global styles and design tokens
├── oauth-worker/        # Cloudflare Worker for GitHub OAuth
└── docs/                # Documentation
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5.x | Static site generation |
| Styling | Tailwind CSS | Utility-first CSS |
| CMS | Decap CMS | Content management |
| Hosting | Cloudflare Pages | Edge deployment |
| Auth | GitHub OAuth | CMS authentication |
| CI/CD | GitHub Actions | Automated deployment |

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npx decap-server` | Start local CMS backend |

## License

MIT License - Use this template for any project.
