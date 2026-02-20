/**
 * Maps generic slugs to their CSS custom property references.
 * Keeps accent colours out of CMS content — the slug determines the colour.
 */

const ACCENT_COLORS: Record<string, string> = {
  primary:  'var(--color-primary)',
  accent1:  'var(--color-accent-1)',
  accent2:  'var(--color-accent-2)',
}

export function getAccentColor(slug: string): string {
  return ACCENT_COLORS[slug] ?? 'var(--color-primary)'
}
