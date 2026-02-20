import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const globalCss = readFileSync(
  join(process.cwd(), 'src/styles/global.css'),
  'utf-8'
)

describe('Brand tokens', () => {
  it('defines core colour CSS custom properties', () => {
    expect(globalCss).toContain('--color-primary:')
    expect(globalCss).toContain('--color-background:')
    expect(globalCss).toContain('--color-surface:')
    expect(globalCss).toContain('--color-text:')
    expect(globalCss).toContain('--color-text-muted:')
    expect(globalCss).toContain('--color-border:')
  })

  it('defines accent colour CSS custom properties', () => {
    expect(globalCss).toContain('--color-accent-1:')
    expect(globalCss).toContain('--color-accent-2:')
  })

  it('registers all brand colours in the @theme block as Tailwind utilities', () => {
    const themeBlockMatch = globalCss.match(/@theme\s*\{([\s\S]*?)\}/)
    expect(themeBlockMatch).not.toBeNull()
    const themeBlock = themeBlockMatch![1]
    expect(themeBlock).toContain('--color-primary')
    expect(themeBlock).toContain('--color-background')
    expect(themeBlock).toContain('--color-surface')
    expect(themeBlock).toContain('--color-text')
    expect(themeBlock).toContain('--color-text-muted')
    expect(themeBlock).toContain('--color-border')
    expect(themeBlock).toContain('--color-accent-1')
    expect(themeBlock).toContain('--color-accent-2')
  })

  it('registers font families in the @theme block', () => {
    const themeBlockMatch = globalCss.match(/@theme\s*\{([\s\S]*?)\}/)
    expect(themeBlockMatch).not.toBeNull()
    const themeBlock = themeBlockMatch![1]
    expect(themeBlock).toContain('--font-sans')
  })

  it('includes a prefers-reduced-motion rule', () => {
    expect(globalCss).toContain('prefers-reduced-motion: reduce')
  })
})
