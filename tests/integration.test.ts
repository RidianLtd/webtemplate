import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Integration and quality tests for the template site.
 * Tests check STRUCTURE not content values — resilient to template customisation.
 */

const srcDir = resolve(__dirname, '../src')
const distDir = resolve(__dirname, '../dist')
const publicDir = resolve(__dirname, '../public')

const indexPage = readFileSync(resolve(srcDir, 'pages/index.astro'), 'utf-8')

function readComponent(name: string): string {
  const filePath = resolve(srcDir, `components/${name}.astro`)
  return existsSync(filePath) ? readFileSync(filePath, 'utf-8') : ''
}

const componentNames = ['Header', 'Footer']
const allComponents = componentNames.map(readComponent).join('\n')
const allSource = indexPage + '\n' + allComponents

describe('Integration: homepage section order', () => {
  it('has a <main> element in the homepage', () => {
    expect(indexPage).toContain('<main')
  })

  it('has Hero, Features, and CTA sections in order', () => {
    const mainMatch = indexPage.match(/<main[^>]*>([\s\S]*?)<\/main>/)
    expect(mainMatch, 'index.astro should have a <main> element').not.toBeNull()
    const mainContent = mainMatch![1]

    // Check all three sections exist and are in order
    const heroIdx = mainContent.indexOf('Hero Section')
    const featuresIdx = mainContent.indexOf('Features Section')
    const ctaIdx = mainContent.indexOf('CTA Section')

    expect(heroIdx).toBeGreaterThanOrEqual(0)
    expect(featuresIdx).toBeGreaterThan(heroIdx)
    expect(ctaIdx).toBeGreaterThan(featuresIdx)
  })

  it('renders Header before main and Footer after', () => {
    const headerIdx = indexPage.indexOf('<Header')
    const mainIdx = indexPage.indexOf('<main')
    const footerIdx = indexPage.indexOf('<Footer')

    expect(headerIdx).toBeGreaterThanOrEqual(0)
    expect(mainIdx).toBeGreaterThan(headerIdx)
    expect(footerIdx).toBeGreaterThan(mainIdx)
  })
})

describe('Integration: anchor link integrity', () => {
  it('all internal href anchors have corresponding id targets', () => {
    const anchorMatches = allSource.matchAll(/href="#([^"]+)"/g)
    const anchors = [...new Set([...anchorMatches].map((m) => m[1]))]
    if (anchors.length === 0) return // No anchor links is fine for template

    const idMatches = allSource.matchAll(/\bid="([^"]+)"/g)
    const ids = new Set([...idMatches].map((m) => m[1]))

    for (const anchor of anchors) {
      expect(
        ids.has(anchor),
        `Anchor link #${anchor} should have a matching element with id="${anchor}"`
      ).toBe(true)
    }
  })
})

describe('Integration: heading hierarchy', () => {
  it('has exactly one h1 across homepage components', () => {
    const h1Matches = allSource.matchAll(/<h1\b/g)
    const count = [...h1Matches].length
    expect(count, 'There should be exactly one h1 on the homepage').toBe(1)
  })

  it('heading levels do not skip', () => {
    const headingMatches = allSource.matchAll(/<h([1-6])\b/g)
    const levels = [...headingMatches].map((m) => parseInt(m[1], 10))
    const uniqueLevels = [...new Set(levels)].sort()

    for (let i = 1; i < uniqueLevels.length; i++) {
      expect(
        uniqueLevels[i] - uniqueLevels[i - 1],
        `Heading levels should not skip: found h${uniqueLevels[i - 1]} then h${uniqueLevels[i]}`
      ).toBeLessThanOrEqual(1)
    }
  })
})

describe('Integration: accessibility', () => {
  it('all images have alt attributes', () => {
    const imgMatches = allSource.matchAll(/<img\b[^>]*>/g)
    for (const match of imgMatches) {
      expect(
        match[0],
        `Image tag should have an alt attribute: ${match[0].substring(0, 80)}`
      ).toMatch(/\balt=/)
    }
  })

  it('Header contains a skip-to-content link', () => {
    const header = readComponent('Header')
    expect(header).toContain('main-content')
    expect(header).toContain('sr-only')
  })

  it('Footer has role="contentinfo"', () => {
    const footer = readComponent('Footer')
    expect(footer).toContain('role="contentinfo"')
  })

  it('main element has id="main-content"', () => {
    expect(indexPage).toContain('id="main-content"')
  })
})

describe('Integration: minimal JS shipped', () => {
  it('no large JS bundles are present in the build output', () => {
    const astroDir = resolve(distDir, '_astro')
    if (existsSync(astroDir)) {
      const files = readdirSync(astroDir)
      const jsFiles = files.filter((f) => f.endsWith('.js'))
      expect(jsFiles.length, 'No standalone JS bundles should be shipped in _astro/').toBe(0)
    }
  })
})

describe('Integration: security headers', () => {
  it('public/_headers file exists with required security headers', () => {
    const headersPath = resolve(publicDir, '_headers')
    expect(existsSync(headersPath), '_headers file should exist in public/').toBe(true)
    const headers = readFileSync(headersPath, 'utf-8')
    expect(headers).toContain('X-Frame-Options: DENY')
    expect(headers).toContain('X-Content-Type-Options: nosniff')
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin')
    expect(headers).toContain('Permissions-Policy: camera=(), microphone=(), geolocation=()')
  })
})
