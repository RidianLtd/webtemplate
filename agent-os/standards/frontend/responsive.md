# Responsive Design Best Practices

## Core Principles

- **Mobile-First Development:** Start with mobile layout and progressively enhance for larger screens
- **Standard Breakpoints:** Consistently use Tailwind breakpoints across the application

## Tailwind Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile styles (default) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops, desktops |
| `xl:` | 1280px | Large desktops |
| `2xl:` | 1536px | Extra large screens |

## Layout Guidelines

- **Fluid Layouts:** Use percentage-based widths and flexible containers that adapt to screen size
- **Relative Units:** Prefer rem/em units over fixed pixels for better scalability and accessibility
- **Max Widths:** Use `max-w-*` classes to constrain content on large screens

## Testing

- **Test Across Devices:** Verify UI changes across multiple screen sizes from mobile to tablet to desktop
- **Balanced Experience:** Ensure a user-friendly viewing and reading experience on all screen sizes

## Interaction Design

- **Touch-Friendly Design:** Ensure tap targets are appropriately sized (minimum 44x44px) for mobile users
- **Performance on Mobile:** Optimize images and assets for mobile network conditions

## Typography

- **Readable Typography:** Maintain readable font sizes across all breakpoints without requiring zoom
- **Content Priority:** Show the most important content first on smaller screens through thoughtful layout decisions

## Example Pattern

```html
<!-- Mobile-first responsive text -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Heading
</h1>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Responsive padding -->
<section class="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
  <!-- Content -->
</section>
```
