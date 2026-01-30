# OAuth Troubleshooting

This guide covers common OAuth authentication issues when using Decap CMS with GitHub.

## Quick Diagnostic Checklist

Before diving into specific errors, verify these basics:

- [ ] OAuth worker is deployed and accessible
- [ ] GitHub OAuth App callback URL matches worker URL + `/callback`
- [ ] `GITHUB_CLIENT_ID` is set in `wrangler.toml`
- [ ] `GITHUB_CLIENT_SECRET` is set via `wrangler secret`
- [ ] CMS `base_url` in `config.yml` matches your worker URL
- [ ] Browser allows popups from your site

## Common Errors

### "No opener window" Error

**Symptom:** After authorizing with GitHub, the popup displays "Error: No opener window. Please close this and try again."

**Causes:**

1. **Popup blocker:** The browser blocked the popup, or the popup lost connection to the opener.

2. **Cross-origin issues:** The popup and the CMS are on different origins.

3. **Popup closed too quickly:** The popup closed before the handshake completed.

**Solutions:**

1. **Allow popups** from your site in browser settings

2. **Disable popup blocker** temporarily to test

3. **Check that the CMS page remains open** while authenticating - do not navigate away

4. **Try a different browser** to rule out browser-specific issues

5. **Check the callback URL** - ensure it matches exactly:
   ```
   GitHub OAuth App Callback URL: https://your-worker.workers.dev/callback
   ```

### Token Exchange Failures

**Symptom:** OAuth popup shows "Authentication Error" with a message about token exchange.

**Causes:**

1. **Invalid client secret:** The secret in Cloudflare does not match GitHub

2. **Expired authorization code:** The code from GitHub expired before exchange

3. **Network issues:** The worker cannot reach GitHub's API

**Solutions:**

1. **Re-set the client secret:**
   ```bash
   cd oauth-worker
   wrangler secret put GITHUB_CLIENT_SECRET
   ```
   Paste the secret from your GitHub OAuth App settings.

2. **Verify the client ID:**
   - Check `wrangler.toml` has the correct `GITHUB_CLIENT_ID`
   - Compare with the Client ID shown in GitHub OAuth App settings

3. **Redeploy the worker:**
   ```bash
   cd oauth-worker
   wrangler deploy
   ```

4. **Check GitHub OAuth App is not suspended:**
   - Go to https://github.com/settings/developers
   - Ensure your OAuth App is active

### CORS Issues

**Symptom:** Browser console shows CORS errors, or the CMS cannot communicate with the OAuth worker.

**Causes:**

1. **Missing CORS headers:** The worker does not return proper CORS headers

2. **Preflight request fails:** OPTIONS requests are not handled

**Solutions:**

The worker includes CORS handling, but verify it is working:

1. **Test the worker directly:**
   ```bash
   curl -I https://your-worker.workers.dev/auth
   ```
   Should return 302 redirect to GitHub.

2. **Check OPTIONS handling:**
   ```bash
   curl -X OPTIONS -I https://your-worker.workers.dev/auth
   ```
   Should return CORS headers.

3. **If CORS headers are missing**, verify the worker code includes:
   ```javascript
   if (request.method === 'OPTIONS') {
     return new Response(null, {
       headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type',
       },
     });
   }
   ```

### Worker Deployment Problems

**Symptom:** Cannot access the worker URL, or deployment fails.

**Solutions:**

1. **Verify Wrangler is logged in:**
   ```bash
   wrangler whoami
   ```
   If not logged in:
   ```bash
   wrangler login
   ```

2. **Check worker name conflicts:**
   - The worker name in `wrangler.toml` must be unique in your account
   - Try a different name if there is a conflict

3. **View deployment logs:**
   ```bash
   wrangler deploy --dry-run
   ```
   This shows what will be deployed without actually deploying.

4. **Check Cloudflare dashboard:**
   - Go to Workers & Pages
   - Find your worker
   - Check for deployment errors or usage limits

### "Authorization callback URL mismatch" from GitHub

**Symptom:** GitHub shows an error about callback URL mismatch.

**Cause:** The callback URL in your OAuth App does not match what the worker sends.

**Solution:**

1. Go to GitHub OAuth App settings
2. Check the "Authorization callback URL"
3. It must be exactly: `https://your-worker-name.your-subdomain.workers.dev/callback`
4. No trailing slash
5. Must use `https://`

### CMS Shows "Login" But Clicking Does Nothing

**Symptom:** The Login button appears but does not open a popup.

**Causes:**

1. **Incorrect `base_url`** in CMS config
2. **Worker not deployed**
3. **JavaScript error**

**Solutions:**

1. **Verify CMS config:**
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/YOUR_REPO
     branch: main
     base_url: https://your-worker.workers.dev  # No trailing slash
     auth_endpoint: /auth
   ```

2. **Check browser console** for JavaScript errors

3. **Test worker directly:**
   Visit `https://your-worker.workers.dev/auth` in browser.
   Should redirect to GitHub authorization.

## Testing the OAuth Flow

### Manual Flow Test

1. **Test the auth endpoint:**
   ```
   https://your-worker.workers.dev/auth
   ```
   Should redirect to GitHub authorization page.

2. **Authorize the app** on GitHub.

3. **Watch the callback:**
   After authorization, you should see a success or error page from the worker.

4. **Check for postMessage:**
   The success page should close automatically after sending the token.

### Browser Console Debugging

Open browser DevTools (F12) before starting the OAuth flow:

1. Go to `/admin` on your site
2. Open Console tab
3. Click Login
4. Watch for messages like:
   - `"OAuth callback - status: success"`
   - `"Sending authorizing:github to opener"`
   - `"Sending token to origin:"`

**Expected flow in console:**

```
OAuth callback - status: success
OAuth callback - data: {token: "gho_xxxxx", provider: "github"}
OAuth callback - opener: Window {...}
Sending authorizing:github to opener
Received message from CMS: authorizing:github origin: https://your-site.pages.dev
Sending token to origin: https://your-site.pages.dev
```

### Worker Logs

View worker logs in Cloudflare dashboard:

1. Go to Workers & Pages
2. Click your OAuth worker
3. Go to "Logs" tab
4. Trigger a login attempt
5. Watch for errors

Or use Wrangler:

```bash
wrangler tail your-worker-name
```

This streams logs in real-time.

## Advanced Debugging

### Check Token Validity

After successful login, verify the token works:

1. Open browser DevTools
2. Go to Application tab > Local Storage
3. Find `netlify-cms-user` entry
4. Copy the `token` value
5. Test with GitHub API:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```
   Should return your GitHub user info.

### Test with Different Accounts

Sometimes issues are account-specific:

1. Try logging in with a different GitHub account
2. Check if that account has access to the repository
3. Verify organization permissions if using an org repo

### Reset Everything

If all else fails, start fresh:

1. **Delete GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Delete the OAuth App
   - Create a new one

2. **Delete and redeploy worker:**
   ```bash
   wrangler delete your-worker-name
   # Update wrangler.toml with new client ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler deploy
   ```

3. **Update CMS config** with new worker URL

4. **Clear browser data:**
   - Local storage
   - Cookies
   - Cache

## Getting Help

If you are still stuck:

1. **Check Decap CMS docs:** https://decapcms.org/docs/
2. **Search GitHub issues:** https://github.com/decaporg/decap-cms/issues
3. **Check worker errors** in Cloudflare dashboard
4. **Provide details** when asking for help:
   - Browser and version
   - Error messages (exact text)
   - Browser console output
   - Worker logs
   - CMS config (without secrets)
