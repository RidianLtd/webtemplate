/**
 * Cloudflare Pages Function: POST /api/enquiry
 * Validates form submissions and stores them in Cloudflare KV.
 * Optionally forwards to a Google Sheet via Apps Script webhook
 * (requires GOOGLE_SHEET_WEBHOOK env var to be set).
 */

interface EnquiryBody {
  name: string
  email: string
  subject?: string
  message?: string
}

interface Env {
  FORM_SUBMISSIONS: KVNamespace
  GOOGLE_SHEET_WEBHOOK?: string
  SITE_ORIGIN?: string
}

const MAX_FIELD_LENGTH = 1000

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function corsHeaders(origin: string | null, siteOrigin: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
  if (origin === siteOrigin || origin === 'http://localhost:4321') {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  const siteOrigin = context.env.SITE_ORIGIN ?? 'https://example.com'
  const origin = context.request.headers.get('Origin')
  return new Response(null, { status: 204, headers: corsHeaders(origin, siteOrigin) })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const siteOrigin = context.env.SITE_ORIGIN ?? 'https://example.com'
  const origin = context.request.headers.get('Origin')
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin, siteOrigin) }

  try {
    const body = (await context.request.json()) as Partial<EnquiryBody>
    const errors: Record<string, string> = {}

    const name = typeof body.name === 'string' ? stripHtml(body.name).trim() : ''
    if (!name) { errors.name = 'Name is required.' }
    else if (name.length > MAX_FIELD_LENGTH) { errors.name = 'Name is too long.' }

    const email = typeof body.email === 'string' ? stripHtml(body.email).trim() : ''
    if (!email) { errors.email = 'Email is required.' }
    else if (!isValidEmail(email)) { errors.email = 'Please provide a valid email address.' }

    const subject = typeof body.subject === 'string'
      ? stripHtml(body.subject).trim().slice(0, MAX_FIELD_LENGTH)
      : ''

    const message = typeof body.message === 'string'
      ? stripHtml(body.message).trim().slice(0, MAX_FIELD_LENGTH)
      : ''

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), { status: 400, headers })
    }

    const submission = {
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
    }

    const key = `form:${Date.now()}:${crypto.randomUUID()}`
    await context.env.FORM_SUBMISSIONS.put(key, JSON.stringify(submission))

    const sheetWebhook = context.env.GOOGLE_SHEET_WEBHOOK
    if (sheetWebhook) {
      try {
        await fetch(sheetWebhook, {
          method: 'POST',
          body: JSON.stringify(submission),
          redirect: 'manual',
        })
      } catch (sheetErr) {
        console.error('Google Sheet webhook failed (non-fatal):', sheetErr)
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers })
  } catch (err) {
    console.error('Enquiry handler error:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error.' }),
      { status: 500, headers }
    )
  }
}
