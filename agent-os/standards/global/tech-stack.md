# Tech Stack

## Overview

This template creates a lightweight static site for performance, simplicity, and ease of content management by non-technical users.

## Core Technologies

### Framework & Build

- **Static Site Generator:** Astro 5.x
- **Language:** TypeScript (strict mode)
- **Build Output:** Static HTML/CSS/JS

### Styling

- **CSS Framework:** Tailwind CSS
- **Approach:** Utility-first, mobile-first responsive design
- **Bundle:** Purged in production for minimal file size

### Content Management

- **CMS:** Decap CMS (formerly Netlify CMS)
- **Content Storage:** Git-based (Markdown/JSON in repository)
- **Authentication:** GitHub OAuth

### Hosting & Deployment

- **Platform:** Cloudflare Pages (Free tier)
- **CDN:** Cloudflare (global edge network)
- **Build Trigger:** GitHub Actions on push to main branch
- **SSL:** Automatic via Cloudflare

## Constraints

### Cloudflare Free Tier Limits

- Stay within Cloudflare Pages free tier limits
- 500 builds per month
- Unlimited bandwidth
- 1 concurrent build

### Performance Requirements

- Zero JavaScript by default (Astro static rendering)
- Use Astro islands only when interactivity is essential
- All images optimized via `astro:assets`
- Target < 100KB initial page load

### No Backend

- This is a purely static site
- No server-side rendering (SSR)
- No API routes
- No database connections

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Progressive enhancement for older browsers
