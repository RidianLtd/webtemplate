/**
 * Cloudflare Worker - GitHub OAuth Proxy for Decap CMS
 * Handles the OAuth flow between the CMS and GitHub
 *
 * This worker enables authentication with private GitHub repositories.
 * It manages the complete OAuth handshake required by Decap CMS.
 */

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Route: /auth - Start OAuth flow
    if (url.pathname === '/auth') {
      const scope = url.searchParams.get('scope') || 'repo,user';
      const state = crypto.randomUUID();

      const authUrl = new URL(GITHUB_AUTHORIZE_URL);
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authUrl.searchParams.set('scope', scope);
      authUrl.searchParams.set('state', state);

      return Response.redirect(authUrl.toString(), 302);
    }

    // Route: /callback - Handle GitHub callback
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        return renderResponse('error', { error });
      }

      if (!code) {
        return renderResponse('error', { error: 'No code provided' });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          return renderResponse('error', {
            error: tokenData.error_description || tokenData.error,
          });
        }

        // Return success page that posts message to opener
        return renderResponse('success', {
          token: tokenData.access_token,
          provider: 'github',
        });
      } catch (err) {
        return renderResponse('error', { error: err.message });
      }
    }

    // Default: show info
    return new Response('OAuth Proxy - Use /auth to start OAuth flow', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};

function renderResponse(status, data) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OAuth ${status === 'success' ? 'Complete' : 'Error'}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a2e;
      color: #eaeaea;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 400px;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #a0a0a0;
      line-height: 1.5;
    }
    .success { color: #4ade80; }
    .error { color: #f87171; }
  </style>
</head>
<body>
  <div class="container">
    ${
      status === 'success'
        ? `
      <h1 class="success">Authorized</h1>
      <p>Authentication successful. You can close this window.</p>
    `
        : `
      <h1 class="error">Authentication Error</h1>
      <p>${data.error}</p>
    `
    }
  </div>
  <script>
    (function() {
      const status = '${status}';
      const data = ${JSON.stringify(data)};

      console.log('OAuth callback - status:', status);
      console.log('OAuth callback - data:', data);
      console.log('OAuth callback - opener:', window.opener);

      if (!window.opener) {
        document.body.innerHTML += '<p style="color: #f87171; margin-top: 1rem;">Error: No opener window. Please close this and try again.</p>';
        return;
      }

      // Handshake: wait for message from CMS, then respond with token
      function receiveMessage(e) {
        console.log('Received message from CMS:', e.data, 'origin:', e.origin);

        // Build the response message
        const message = status === 'success'
          ? 'authorization:github:success:' + JSON.stringify({ token: data.token, provider: 'github' })
          : 'authorization:github:error:' + JSON.stringify({ message: data.error });

        console.log('Sending token to origin:', e.origin);

        // Send to the CMS's origin
        window.opener.postMessage(message, e.origin);
        window.removeEventListener('message', receiveMessage, false);

        // Close after short delay
        setTimeout(() => window.close(), 1000);
      }

      window.addEventListener('message', receiveMessage, false);

      // Tell CMS we're ready for handshake
      console.log('Sending authorizing:github to opener');
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
