/**
 * Shared markdown rendering utilities.
 * Uses `marked` with a custom renderer that opens links in new tabs.
 */
import { marked } from 'marked'

const renderer = new marked.Renderer()
renderer.link = ({ href, text }) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`

/** Render markdown to HTML (block-level — wraps in <p>, supports lists, headings, etc.) */
export function renderMarkdown(text: string): string {
  return marked.parse(text, { renderer }) as string
}

/** Render markdown to HTML (inline only — no wrapping <p>, for use inside existing elements) */
export function renderInlineMarkdown(text: string): string {
  return marked.parseInline(text, { renderer }) as string
}
