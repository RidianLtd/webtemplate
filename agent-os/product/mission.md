# Product Mission

## Pitch

**Webtemplate** is a production-ready starter template that helps developers rapidly deploy content-managed websites by providing a pre-configured Astro + Decap CMS + Cloudflare Pages stack with all the hard problems already solved.

## Users

### Primary Customers

- **Solo Developers:** Freelancers and indie developers building marketing sites for clients who need CMS access
- **Small Agencies:** Teams that need a repeatable, reliable starting point for content-driven websites
- **Startups:** Technical founders who want a professional web presence with zero ongoing hosting costs

### User Personas

**Alex the Freelancer** (28-40)

- **Role:** Independent web developer building sites for small businesses
- **Context:** Needs to deliver polished websites quickly while keeping hosting costs minimal for clients
- **Pain Points:** Setting up CMS authentication with private repos is painful; deployment pipelines take hours to configure; every project starts from scratch
- **Goals:** Ship client sites faster with a reliable stack; hand off content editing to non-technical clients; minimize ongoing maintenance

**Sam the Startup Founder** (25-45)

- **Role:** Technical co-founder at an early-stage startup
- **Context:** Needs a marketing site that looks professional but cannot justify spending engineering time on infrastructure
- **Pain Points:** Marketing sites feel like a distraction from the core product; wants to delegate content updates to marketing team members
- **Goals:** Get a fast, professional site live in hours not days; enable non-technical team members to update content; pay nothing for hosting

## The Problem

### The "Last Mile" Problem with Static Site CMSs

Setting up a modern static site with a headless CMS sounds simple until you hit the implementation details. Decap CMS with GitHub backend requires OAuth authentication that does not work out-of-the-box with private repositories on Cloudflare Pages. Cloudflare Pages projects created via direct upload lack Git integration, requiring manual GitHub Actions setup. Dynamic routing for CMS-managed pages has undocumented gotchas. Path aliases need configuration in multiple places. Developers spend hours solving the same problems repeatedly.

**Our Solution:** A template that has already solved these integration challenges with working code, proper configuration, and comprehensive documentation explaining the "why" behind each decision.

## Differentiators

### Battle-Tested Configuration

Unlike generic Astro starters, we provide a complete working OAuth solution (Cloudflare Worker) for Decap CMS with private GitHub repos. This single piece alone saves 4-8 hours of debugging and research.

### Zero-Cost Production Ready

Unlike templates that assume Netlify or Vercel, we target Cloudflare's free tier explicitly. GitHub Actions workflow, Cloudflare Worker OAuth proxy, and static deployment are all configured to stay within free tier limits indefinitely.

### Documentation That Explains Why

Unlike templates that just provide code, we document the reasoning behind architectural decisions. When something breaks or needs customization, developers understand the system well enough to adapt it.

## Key Features

### Core Features

- **Pre-configured Astro 5.x Project:** TypeScript strict mode, Tailwind CSS, and sensible defaults so developers start with a solid foundation
- **Working Decap CMS Integration:** GitHub backend with OAuth authentication that actually works with private repositories
- **Cloudflare Worker OAuth Proxy:** Ready-to-deploy worker implementing the complete OAuth handshake protocol for GitHub authentication
- **GitHub Actions Deployment:** Automated workflow that deploys to Cloudflare Pages on every push to main

### Content Management Features

- **Homepage Content Collection:** Editable hero, features, and CTA sections manageable through the CMS admin panel
- **Dynamic Pages Collection:** Create new pages from the CMS using `[...slug].astro` routing with proper `getStaticPaths()` implementation
- **Markdown Rendering:** Pre-configured `marked` package integration for rendering CMS content to HTML

### Developer Experience Features

- **Path Aliases:** `@/` aliases configured in both `tsconfig.json` and Astro's Vite config so imports work everywhere
- **Customizable Design Tokens:** Tailwind config with CSS custom properties for easy brand customization
- **Comprehensive README:** Step-by-step setup instructions covering GitHub OAuth app creation, Cloudflare Worker deployment, and environment variables
