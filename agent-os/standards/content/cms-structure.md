# CMS Structure Standards

## Overview

Content is managed via Decap CMS, a Git-based headless CMS. Non-technical editors access a web UI at `/admin` to create and edit content, which is stored as Markdown or JSON files in the repository.

## Content Collections

### Settings (`src/content/settings/`)

Site-wide configuration:

- `general.json` - Site title, tagline, default description

### Homepage (`src/content/homepage/`)

Homepage content:

- `content.json` - Hero section, features list, CTA section

### Pages (`src/content/pages/`)

Dynamic pages with:

- `title` (string, required)
- `slug` (string, required)
- `tagline` (string, optional)
- `body` (markdown, required)
- `cta_text` (string, optional)
- `cta_email` (string, optional)

## File Naming

### Collection Items

- Use kebab-case: `about-us.md`
- Be descriptive and URL-friendly
- For dated content, prefix with date: `2025-03-15-update.md`

### Media Files

- Store in `public/uploads/`
- Use descriptive names: `hero-image-2025.jpg`
- Avoid spaces and special characters

## Frontmatter Format

All markdown content files use YAML frontmatter:

```markdown
---
title: 'About Us'
slug: about
tagline: 'Learn more about our team'
cta_text: 'Contact Us'
cta_email: 'hello@example.com'
---

The main content goes here in Markdown format.

## Subheading

More content...
```

## CMS Configuration

### Backend

```yaml
backend:
  name: github
  repo: owner/repo
  branch: main
  base_url: https://oauth-worker.workers.dev
  auth_endpoint: /auth
```

### Media

```yaml
media_folder: public/uploads
public_folder: /uploads
```

### Collections

Each collection in `config.yml` maps to a `src/content/` subfolder.

## Local Development

For local development without OAuth:

```yaml
local_backend: true
```

Run `npx decap-server` alongside `npm run dev` to enable local CMS.

## Content Guidelines

### Markdown

- Use standard Markdown syntax
- Images via `![alt text](/uploads/image.jpg)`
- Links via `[text](url)`
- Keep formatting simple

### Images

- Recommended sizes:
  - Hero images: 1920x1080
  - Card thumbnails: 800x600
- Use WebP or optimized JPEG
- Always include alt text
