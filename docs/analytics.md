# PostHog Analytics

The template includes a PostHog analytics integration that tracks page views, scroll depth, CTA clicks, outbound links, and time on page. It ships with a `PLACEHOLDER` API key — **no data is sent until you configure it**.

## Setup

### 1. Create a PostHog Account

1. Sign up at [posthog.com](https://posthog.com) (generous free tier)
2. Create a project
3. Copy your **Project API Key** from Settings > Project > API Key

### 2. Activate Analytics

Open `src/layouts/BaseLayout.astro` and find this line:

```javascript
var POSTHOG_API_KEY = 'PLACEHOLDER';
```

Replace `PLACEHOLDER` with your project API key:

```javascript
var POSTHOG_API_KEY = 'phc_your_actual_key_here';
```

That's it. The guard `if (POSTHOG_API_KEY !== 'PLACEHOLDER')` ensures zero PostHog calls until configured.

## Event Reference

| Event | Trigger | Properties |
|-------|---------|------------|
| `section_viewed` | 30% of a `section[id]` element is visible | `section` (element id) |
| `scroll_depth` | User scrolls past 25%, 50%, 75%, or 100% | `depth` (25/50/75/100) |
| `cta_clicked` | Click on `a[href^="#"]` (internal anchor) | `href`, `text`, `from_section` |
| `outbound_click` | Click on `a[target="_blank"]` (external link) | `url`, `text` |
| `page_time` | Page becomes hidden (tab switch/close) | `seconds` (time on page) |

## Campaign Parameter Tracking

The snippet automatically captures these URL parameters and registers them as PostHog properties:

| Parameter | Description |
|-----------|-------------|
| `ref` | Referral identifier — also used to `posthog.identify()` the user |
| `src` | Traffic source |
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |

Example: `https://example.com/?ref=partner123&utm_source=newsletter`

## Adding Custom Events

Use `window.posthog.capture()` anywhere in your code:

```javascript
window.posthog.capture('my_custom_event', {
  property1: 'value1',
  property2: 'value2'
});
```

Always guard with a check:

```javascript
if (window.posthog && window.posthog.capture) {
  window.posthog.capture('my_event', { key: 'value' });
}
```

## Disabling Analytics

To completely remove analytics, delete the two `<script is:inline>` blocks from `src/layouts/BaseLayout.astro`:

1. The PostHog initialization block in `<head>` (starts with `!function(t,e)`)
2. The behavioral tracking block before `</body>` (starts with `(function()`)
