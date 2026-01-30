# Coding Style

## TypeScript

### General

- Use strict mode (`"strict": true` in tsconfig)
- Prefer `const` over `let`; never use `var`
- Use explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/intersections

### Naming Conventions

- **Files:** kebab-case (`event-card.astro`, `content-utils.ts`)
- **Components:** PascalCase (`FeatureCard.astro`, `Header.astro`)
- **Functions:** camelCase (`getPageContent`, `formatDate`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_ITEMS_PER_PAGE`)
- **Types/Interfaces:** PascalCase (`PageData`, `HomepageContent`)

### Imports

- Group imports: external packages, then internal modules, then relative imports
- Use path aliases (`@/components`, `@/utils`) where configured

## Astro Components

### Structure

```astro
---
// 1. Imports
import Layout from '@/layouts/BaseLayout.astro'
import fs from 'node:fs'

// 2. Props interface
interface Props {
  title: string
}

// 3. Props destructuring
const { title } = Astro.props

// 4. Data fetching / logic
const content = JSON.parse(fs.readFileSync('...', 'utf-8'))
---

<!-- 5. Template -->
<Layout title={title}>
  <main>
    <!-- content -->
  </main>
</Layout>

<!-- 6. Scoped styles (if needed) -->
<style>
  /* component-specific styles */
</style>
```

### Best Practices

- Keep frontmatter logic minimal
- Extract complex logic to utility functions
- Use slots for composition
- Prefer props over global state

## CSS / Tailwind

### Tailwind Usage

- Use utility classes directly in templates
- Extract repeated patterns to `@apply` in component styles
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Leverage CSS custom properties for theming

### Custom CSS

- Only when Tailwind utilities are insufficient
- Scope to component using `<style>` block
- Use CSS custom properties for colors and spacing

## File Organization

### Naming

- One component per file
- File name matches component name (PascalCase for components)
- Use `.astro` for components, `.ts` for utilities, `.md` for content
