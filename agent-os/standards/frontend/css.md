# CSS Best Practices

## Methodology

- **Consistent Methodology:** Apply and stick to Tailwind utility-first approach across the entire project
- **Avoid Overriding Framework Styles:** Work with Tailwind's patterns rather than fighting against them with excessive overrides
- **Maintain Design System:** Establish and document design tokens (colors, spacing, typography) using CSS custom properties
- **Minimize Custom CSS:** Leverage Tailwind utilities to reduce custom CSS maintenance burden
- **Performance Considerations:** Tailwind automatically purges unused styles in production builds

## CSS Custom Properties

Define design tokens in `src/styles/global.css`:

```css
:root {
  --color-primary: #3B82F6;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-border: #334155;
}
```

## Tailwind Configuration

Map CSS variables to Tailwind in `global.css`:

```css
@theme {
  --color-primary: var(--color-primary);
  --color-background: var(--color-background);
  /* etc */
}
```

## When to Use Custom CSS

- Complex animations not achievable with Tailwind
- Prose/typography styling for markdown content
- Third-party component overrides
- Pseudo-element styling (::before, ::after)

## Scoped Styles in Astro

Use the `<style>` block in components:

```astro
<div class="my-component">Content</div>

<style>
  .my-component {
    /* Scoped to this component only */
  }
</style>
```

For global selectors within component styles, use `:global()`:

```astro
<style>
  .prose :global(h2) {
    /* Styles injected HTML content */
  }
</style>
```
