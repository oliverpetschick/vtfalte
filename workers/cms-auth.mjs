const callbackUrl = 'https://vtfalte-cms-auth.oliver-petschick.workers.dev/callback';
const editorOrigins = ['https://www.vtfalte.de', 'http://localhost:3000'];
const cookieName = '__Host-vtfalte-oauth';
const random = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
const cookie = (value, age) => `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
const response = (body, status = 200, headers = {}) => new Response(body, {
  status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff', 'Content-Type': 'text/plain; charset=utf-8', ...headers },
});

function complete(token) {
  const nonce = random();
  const message = JSON.stringify(`authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`)
    .replace(/</g, '\\u003c');
  return response(`<!doctype html><html lang="de"><meta charset="utf-8">
<title>VT-Falte Anmeldung</title><p>Anmeldung abgeschlossen. Dieses Fenster schließt sich automatisch.</p>
<script nonce="${nonce}">
const origins = ${JSON.stringify(editorOrigins)};
const receive = event => {
  if (event.source !== window.opener || !origins.includes(event.origin) || event.data !== 'authorizing:github') return;
  window.removeEventListener('message', receive);
  window.opener.postMessage(${message}, event.origin);
};
window.addEventListener('message', receive);
if (window.opener) for (const origin of origins) window.opener.postMessage('authorizing:github', origin);
</script></html>`, 200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; frame-ancestors 'none'; base-uri 'none'`,
    'Set-Cookie': cookie('', 0),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET') return response('Method not allowed', 405);
    if (url.pathname === '/') return response('VT-Falte CMS authentication service');
    if (!['/auth', '/callback'].includes(url.pathname)) return response('Not found', 404);
    if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) return response('Authentication is not configured', 503);
    try {
      if (url.pathname === '/auth') {
        if (url.searchParams.get('provider') !== 'github') return response('Unsupported provider', 400);
        const state = random();
        const verifier = random();
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
        const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const authorize = new URL('https://github.com/login/oauth/authorize');
        authorize.search = new URLSearchParams({ client_id: env.GITHUB_OAUTH_ID,
          redirect_uri: callbackUrl, scope: 'public_repo', login: 'oliverpetschick',
          state, code_challenge: challenge, code_challenge_method: 'S256' }).toString();
        return response('', 302, { Location: authorize.href, 'Set-Cookie': cookie(`${state}.${verifier}`, 600) });
      }

      const session = (request.headers.get('Cookie') ?? '').split(';')
        .map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
      const [state, verifier] = (session ?? '').split('.');
      const code = url.searchParams.get('code');
      if (!/^[a-f0-9]{64}$/.test(state ?? '') || !/^[a-f0-9]{64}$/.test(verifier ?? '') ||
          state !== url.searchParams.get('state') || !code) {
        return response('Anmeldung ungültig oder abgelaufen. Bitte erneut im CMS anmelden.', 400,
          { 'Set-Cookie': cookie('', 0) });
      }
      const exchange = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_OAUTH_ID, client_secret: env.GITHUB_OAUTH_SECRET,
          code, redirect_uri: callbackUrl, code_verifier: verifier }),
      });
      const token = await exchange.json();
      if (!exchange.ok || typeof token.access_token !== 'string' || !token.access_token) throw new Error('Token exchange failed');
      const identity = await fetch('https://api.github.com/user', {
        headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token.access_token}`,
          'User-Agent': 'vtfalte-cms-auth' },
      });
      const user = await identity.json();
      if (!identity.ok || user.login?.toLowerCase() !== 'oliverpetschick') {
        return response('Dieser GitHub-Account ist nicht für das CMS freigeschaltet.', 403,
          { 'Set-Cookie': cookie('', 0) });
      }
      return complete(token.access_token);
    } catch {
      return response('Anmeldung fehlgeschlagen. Bitte erneut im CMS anmelden.', 502,
        { 'Set-Cookie': cookie('', 0) });
    }
  },
};
