import assert from 'node:assert/strict';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import worker from '../workers/cms-auth.mjs';

const origin = 'https://vtfalte-cms-auth.oliver-petschick.workers.dev';
const env = { GITHUB_OAUTH_ID: 'test-id', GITHUB_OAUTH_SECRET: 'test-secret' };
async function begin() {
  const result = await worker.fetch(new Request(`${origin}/auth?provider=github`), env);
  const authorize = new URL(result.headers.get('Location'));
  const cookie = result.headers.get('Set-Cookie').split(';')[0];
  const callback = new Request(`${origin}/callback?code=test-code&state=${authorize.searchParams.get('state')}`,
    { headers: { Cookie: cookie } });
  return { result, authorize, cookie, callback };
}

test('authorization binds state and PKCE to a secure browser cookie', async () => {
  const { result, authorize, cookie } = await begin();
  assert.equal(result.status, 302);
  assert.equal(authorize.origin, 'https://github.com');
  assert.equal(authorize.searchParams.get('redirect_uri'), `${origin}/callback`);
  assert.equal(authorize.searchParams.get('scope'), 'public_repo');
  assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(authorize.searchParams.get('code_challenge').length, 43);
  assert.ok(cookie.includes(authorize.searchParams.get('state')));
  assert.match(result.headers.get('Set-Cookie'), /HttpOnly; Secure; SameSite=Lax; Max-Age=600/);
});

test('missing or mismatched state fails before contacting GitHub', async t => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected network request'); });
  const { callback, cookie } = await begin();
  for (const request of [new Request(callback.url),
    new Request(`${origin}/callback?code=test&state=wrong`, { headers: { Cookie: cookie } })]) {
    assert.equal((await worker.fetch(request, env)).status, 400);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('a different GitHub account receives no token', async t => {
  t.mock.method(globalThis, 'fetch', async url => Response.json(url.endsWith('/user')
    ? { login: 'someone-else' } : { access_token: 'private-token' }));
  const { callback } = await begin();
  const result = await worker.fetch(callback, env);
  assert.equal(result.status, 403);
  assert.equal((await result.text()).includes('private-token'), false);
});

test('the token is delivered only to the allowed editor opener', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.endsWith('/user')) return Response.json({ login: 'oliverpetschick' });
    assert.equal(JSON.parse(options.body).code_verifier.length, 64);
    return Response.json({ access_token: 'private-token' });
  });
  const { callback } = await begin();
  const result = await worker.fetch(callback, env);
  assert.equal(result.status, 200);
  assert.match(result.headers.get('Set-Cookie'), /Max-Age=0/);
  assert.match(result.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  const html = await result.text();
  const messages = [];
  let receive;
  const opener = { postMessage: (...args) => messages.push(args) };
  runInNewContext(html.match(/<script nonce="[^"]+">([\s\S]*?)<\/script>/)[1], {
    window: { opener, addEventListener: (_, handler) => { receive = handler; }, removeEventListener() {} },
  });
  assert.equal(messages.length, 2);
  assert.ok(messages.every(([message, target]) => message === 'authorizing:github' && target !== '*'));
  receive({ source: opener, origin: 'https://attacker.example', data: 'authorizing:github' });
  receive({ source: {}, origin: 'https://www.vtfalte.de', data: 'authorizing:github' });
  assert.equal(messages.length, 2);
  receive({ source: opener, origin: 'http://localhost:3000', data: 'authorizing:github' });
  assert.equal(messages[2][1], 'http://localhost:3000');
  assert.match(messages[2][0], /authorization:github:success:.*private-token/);
});

test('GitHub failures never expose upstream responses or secrets', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('private-token test-secret'); });
  const { callback } = await begin();
  const result = await worker.fetch(callback, env);
  assert.equal(result.status, 502);
  assert.doesNotMatch(await result.text(), /private-token|test-secret/);
});
