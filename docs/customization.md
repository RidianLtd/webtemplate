# Customization Guide

This guide explains how to customize the template's visual identity and structure.

## Brand Identity

### Color System

All colors are defined as CSS custom properties in `src/styles/global.css`:

```css
:root {
  /* Primary brand color - customize per brand */
  --color-primary: #3B82F6;

  /* Background colors */
  --color-background: #0F172A;
  --color-surface: #1E293B;

  /* Text colors */
  --color-text: #F8FAFC;
  --color-text-muted: #94A3B8;

  /* Border colors */
  --color-border: #334155;
}
```

**To change your brand colors:**

1. Open `src/styles/global.css`
2. Update the hex values in `:root`
3. Save and the entire site updates

**Example: Blue theme to Green theme**

```css
:root {
  --color-primary: #10B981;        /* Emerald green */
  --color-background: #022C22;     /* Dark green */
  --color-surface: #064E3B;        /* Surface green */
  --color-text: #F0FDF4;           /* Light green-white */
  --color-text-muted: #86EFAC;     /* Muted green */
  --color-border: #047857;         /* Border green */
}
```

**Example: Light theme**

```css
:root {
  --color-primary: #2563EB;        /* Blue */
  --color-background: #FFFFFF;     /* White */
  --color-surface: #F8FAFC;        /* Light gray */
  --color-text: #0F172A;           /* Dark text */
  --color-text-muted: #64748B;     /* Gray text */
  --color-border: #E2E8F0;         /* Light border */
}
```

### How Colors Work with Tailwind

The CSS variables are mapped to Tailwind in the same file:

```css
@theme {
  --color-primary: var(--color-primary);
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-border: var(--color-border);
}
```

This means you can use these colors with Tailwind classes:

```html
<div class="bg-background text-text">
  <h1 class="text-primary">Heading</h1>
  <p class="text-text-muted">Muted paragraph</p>
</div>
```

### Typography

Fonts are configured in two places:

**1. Google Fonts (BaseLayout.astro):**

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

To change fonts:

1. Visit [Google Fonts](https://fonts.google.com)
2. Select your fonts
3. Copy the `<link>` tag
4. Replace the link in `src/layouts/BaseLayout.astro`

**2. CSS Configuration (global.css):**

```css
@theme {
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Inter', sans-serif;
}
```

Update the font names to match your Google Fonts selection.

**Example: Different heading font**

```css
@theme {
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Poppins', sans-serif;  /* Different for headings */
}
```

### CMS Login Page Styling

The CMS admin page has its own styling in `public/admin/index.html`. To customize:

```html
<style>
  body {
    background-color: #0F172A;  /* Match your background */
  }
  /* Logo or branding */
  .login-header {
    /* Add your styles */
  }
</style>
```

## Homepage Structure

### Content Sources

The homepage reads from two JSON files:

- `src/content/settings/general.json` - Site title and tagline
- `src/content/homepage/content.json` - Hero, features, and CTA sections

### Modifying Sections

The homepage template is `src/pages/index.astro`. Each section is clearly marked:

```astro
<!-- Hero Section -->
<section class="...">
  <h1>{content.hero.headline}</h1>
  ...
</section>

<!-- Features Section -->
<section class="...">
  {content.features.map(feature => (
    <div>...</div>
  ))}
</section>

<!-- CTA Section -->
<section class="...">
  ...
</section>
```

### Adding a Section

1. Add the content structure to `src/content/homepage/content.json`:

```json
{
  "hero": { ... },
  "features": [ ... ],
  "testimonials": [
    {
      "quote": "This product is amazing!",
      "author": "Jane Doe",
      "role": "CEO, Example Inc"
    }
  ],
  "cta": { ... }
}
```

2. Add the CMS fields in `public/admin/config.yml`:

```yaml
- name: testimonials
  label: Testimonials
  widget: list
  fields:
    - { name: quote, label: Quote, widget: text }
    - { name: author, label: Author Name, widget: string }
    - { name: role, label: Author Role, widget: string }
```

3. Add the section to `src/pages/index.astro`:

```astro
<!-- Testimonials Section -->
<section class="py-16 px-4 bg-surface">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-text mb-12">
      What People Say
    </h2>
    <div class="grid gap-8 md:grid-cols-2">
      {content.testimonials.map(t => (
        <blockquote class="p-6 border border-border">
          <p class="text-text-muted italic mb-4">"{t.quote}"</p>
          <footer class="text-text font-semibold">
            {t.author}
            <span class="text-text-muted font-normal block">{t.role}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  </div>
</section>
```

### Removing a Section

1. Remove the content from `content.json`
2. Remove the CMS fields from `config.yml`
3. Remove the section from `index.astro`

## Component Customization

### Header

The header component is in `src/components/Header.astro`. Key customization points:

**Logo/Site Title:**
```astro
<a href="/" class="text-2xl font-bold text-text">
  {settings.site_title}
</a>
```

To use an image logo:
```astro
<a href="/">
  <img src="/logo.svg" alt={settings.site_title} class="h-8" />
</a>
```

**Navigation Links:**
```astro
<nav>
  <a href="/" class="...">Home</a>
  <a href="/about" class="...">About</a>
</nav>
```

To make navigation CMS-editable, see [Adding Collections](adding-collections.md) for how to add a navigation collection.

### Footer

The footer is in `src/components/Footer.astro`. Customize:

- Copyright text
- Tagline
- Social links
- Footer navigation

### Button Styles

Buttons use consistent styling. The primary button pattern:

```html
<a class="inline-block bg-primary text-background px-8 py-4 font-semibold text-lg
          transition-all duration-200 hover:opacity-90 hover:translate-y-[-2px]">
  Button Text
</a>
```

To modify all buttons:

1. Create a shared class in `global.css`:

```css
.btn-primary {
  @apply inline-block bg-primary text-background px-8 py-4 font-semibold;
  @apply transition-all duration-200 hover:opacity-90;
}

.btn-secondary {
  @apply inline-block border border-primary text-primary px-8 py-4 font-semibold;
  @apply transition-all duration-200 hover:bg-primary hover:text-background;
}
```

2. Use in templates:
```html
<a class="btn-primary">Primary Action</a>
<a class="btn-secondary">Secondary Action</a>
```

## Dynamic Page Styling

Pages rendered from markdown (`[...slug].astro`) have prose styling for content. Customize in the `<style>` block:

```astro
<style>
  .prose-content :global(h2) {
    font-size: 1.5rem;
    color: var(--color-primary);
    /* Add your styles */
  }

  .prose-content :global(p) {
    color: var(--color-text-muted);
    line-height: 1.75;
  }
</style>
```

The `:global()` selector is needed because the HTML is injected with `set:html`.

## Adding Custom CSS

### Component-Scoped CSS

Add styles inside the component:

```astro
---
// Component logic
---

<div class="my-component">
  Content
</div>

<style>
  .my-component {
    /* Only affects this component */
  }
</style>
```

### Global CSS

Add to `src/styles/global.css`:

```css
/* Add after existing styles */

/* Custom utility classes */
.text-gradient {
  background: linear-gradient(90deg, var(--color-primary), #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Use anywhere:
```html
<h1 class="text-gradient">Gradient Heading</h1>
```

## Responsive Design

The template uses Tailwind's responsive prefixes:

- `sm:` - 640px and up (tablets)
- `md:` - 768px and up (small laptops)
- `lg:` - 1024px and up (desktops)
- `xl:` - 1280px and up (large screens)

Example:
```html
<div class="text-xl md:text-3xl lg:text-5xl">
  Responsive heading
</div>
```

Mobile-first approach: Start with mobile styles, add larger screen overrides.

## Advanced: Adding Dark/Light Mode Toggle

To support both dark and light modes:

1. Define both palettes:

```css
:root {
  /* Light mode (default) */
  --color-background: #FFFFFF;
  --color-text: #0F172A;
}

[data-theme="dark"] {
  --color-background: #0F172A;
  --color-text: #F8FAFC;
}
```

2. Add toggle script (requires Astro island):

```astro
<script>
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Load saved preference
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
</script>
```

Note: This adds JavaScript to the page. Consider if it is truly necessary for your use case.
