# Astro Standards

## Core Principles

### Static-First

- All pages are statically generated at build time
- No SSR (server-side rendering) - we deploy to Cloudflare Pages
- Zero client-side JavaScript by default

### Islands Architecture

Use Astro islands (`client:*` directives) sparingly and only when necessary:

```astro
<!-- Only hydrate when visible (lazy loading) -->
<InteractiveComponent client:visible />

<!-- Only hydrate on idle -->
<InteractiveComponent client:idle />

<!-- Avoid: immediate hydration unless truly needed -->
<InteractiveComponent client:load />
```

**When to use islands:**

- Form validation with real-time feedback
- Interactive carousels/sliders
- Search functionality
- Video/audio players with custom controls

**When NOT to use islands:**

- Static content display
- Navigation (use CSS for mobile menus)
- Simple animations (use CSS)

## Content Reading

### File-based Content

Use `fs.readFileSync` for JSON content:

```typescript
import fs from 'node:fs'
import path from 'node:path'

const content = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'src/content/homepage/content.json'),
    'utf-8'
  )
)
```

### Dynamic Routes with Markdown

Use `fs.readdirSync` in `getStaticPaths()`:

```typescript
export async function getStaticPaths() {
  const pagesDir = path.join(process.cwd(), 'src/content/pages')
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'))

  return files.map(file => {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8')
    const { frontmatter, body } = parseMarkdown(content)
    return {
      params: { slug: frontmatter.slug },
      props: { ...frontmatter, content: body }
    }
  })
}
```

Note: `import.meta.glob` does not work inside `getStaticPaths()`.

## Components

### Props Pattern

Always define props interface:

```astro
---
interface Props {
  title: string
  description?: string
  class?: string
}

const { title, description, class: className } = Astro.props
---

<article class:list={['card', className]}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</article>
```

### Slots

Use named slots for flexible composition:

```astro
<!-- Layout.astro -->
<header>
  <slot name="header" />
</header>
<main>
  <slot />  <!-- default slot -->
</main>
<footer>
  <slot name="footer" />
</footer>
```

## Layouts

### Base Layout Pattern

```astro
---
interface Props {
  title: string
  description?: string
}

const { title, description = 'Default description' } = Astro.props
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Performance Checklist

- [ ] No unnecessary `client:*` directives
- [ ] Images use `astro:assets` for optimization
- [ ] CSS is minimal and scoped
- [ ] Fonts loaded with `font-display: swap`
- [ ] Critical CSS inlined in head
