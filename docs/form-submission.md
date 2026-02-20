# Form Submission Handler

The template includes a ready-to-use contact form API endpoint powered by Cloudflare Pages Functions and KV storage.

## Architecture

```
Browser POST /api/enquiry
  → Cloudflare Pages Function (functions/api/enquiry.ts)
    → Validates fields (name, email required)
    → Strips HTML from all inputs
    → Stores in Cloudflare KV (FORM_SUBMISSIONS namespace)
    → Optionally forwards to Google Sheets webhook
  ← Returns JSON { success: true } or { success: false, errors: {...} }
```

## Setup

### 1. Create KV Namespace

```bash
npx wrangler kv namespace create FORM_SUBMISSIONS
```

This outputs a namespace ID. Add it to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "FORM_SUBMISSIONS"
id = "YOUR_KV_NAMESPACE_ID"
```

### 2. Set SITE_ORIGIN (CORS)

In the Cloudflare Pages dashboard, set the `SITE_ORIGIN` environment variable to your production URL (e.g. `https://example.com`). The function allows requests from this origin and `http://localhost:4321` for development.

### 3. Optional: Google Sheets Webhook

To forward submissions to a Google Sheet:

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Create a web app with this pattern:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.submittedAt,
    data.name,
    data.email,
    data.subject,
    data.message
  ]);
  return ContentService.createTextOutput('OK');
}
```

4. Deploy as a web app (Execute as: Me, Access: Anyone)
5. Copy the web app URL
6. In Cloudflare Pages dashboard, set `GOOGLE_SHEET_WEBHOOK` to the URL

The webhook is fire-and-forget — if it fails, the KV submission is still saved.

## Customising Form Fields

### Adding/removing fields

1. Update the `EnquiryBody` interface in `functions/api/enquiry.ts`
2. Add validation logic for new required fields
3. Include the field in the `submission` object
4. Update the frontend form to include matching input fields

### Default fields

| Field | Required | Max Length |
|-------|----------|-----------|
| `name` | Yes | 1000 chars |
| `email` | Yes | Valid email format |
| `subject` | No | 1000 chars |
| `message` | No | 1000 chars |

## API Reference

### `POST /api/enquiry`

**Request body** (JSON):

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Partnership enquiry",
  "message": "I'd like to discuss..."
}
```

**Success response** (200):

```json
{ "success": true }
```

**Validation error** (400):

```json
{
  "success": false,
  "errors": {
    "name": "Name is required.",
    "email": "Please provide a valid email address."
  }
}
```

**Server error** (500):

```json
{ "success": false, "error": "Internal server error." }
```
