# Technical Specification

Infrastructure, deployment, and service configuration for the site build. This is filled in by whoever is handling the technical setup — it can be completed before, during, or after the product PRD.

The `/build-from-prd` skill reads both `prd.md` and this file. Product requirements come from `prd.md`; everything here is about wiring up services.

---

## Infrastructure

```yaml
# Domain and hosting configuration.
domain: ""                        # production domain without protocol (e.g. "acme.com")
                                  # leave blank to use {cloudflare_pages_project}.pages.dev
github_repo: ""                   # required — "username/repo-name" (e.g. "acme-org/acme-website")
cloudflare_pages_project: ""      # required — Cloudflare Pages project name (e.g. "acme-website")
oauth_worker_name: ""             # required — Cloudflare Worker name for CMS auth (e.g. "acme-oauth")
github_oauth_client_id: ""        # GitHub OAuth App client ID — can be set later during deployment
deploy_branch: "main"             # branch that triggers production deploys
```

---

## Services

```yaml
# Third-party integrations. All optional — features activate only when configured.
posthog_api_key: ""               # PostHog project API key (e.g. "phc_abc123...")
                                  # enables analytics: page views, scroll depth, CTA clicks, etc.
google_sheet_webhook_url: ""      # Google Apps Script webhook URL for forwarding form submissions
                                  # see docs/form-submission.md for setup
kv_namespace_id: ""               # Cloudflare KV namespace ID for storing form submissions
                                  # create with: npx wrangler kv namespace create FORM_SUBMISSIONS
```
