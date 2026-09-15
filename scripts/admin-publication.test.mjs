import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/admin/admin.js', import.meta.url), 'utf8');
const publicationCode = source.slice(source.indexOf('  const statusElement ='),
  source.indexOf("  publishStandButton.addEventListener('click', publishStand);"));

function editor() {
  const status = { dataset: {}, replaceChildren(text) { this.text = text; }, append() {} };
  const button = { setAttribute() {} };
  const calls = [];
  const responses = [];
  const document = {
    getElementById: () => status, createElement: () => button,
    createTextNode: text => text, body: { appendChild() {} },
  };
  const fetch = async (url, options) => {
    calls.push({ url, options });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return { ok: true, json: async () => next };
  };
  const window = { confirm() {}, localStorage: { getItem: () => JSON.stringify({ token: 'test-token' }) } };
  const api = new Function('document', 'window', 'fetch', 'setTimeout', 'clearTimeout', 'queueMicrotask',
    `const localMode = false; const adaptAdmin = () => {}; ${publicationCode}
     return { pollPublishStatus, publishStand };`)(document, window, fetch, () => 1, () => {}, fn => fn());
  return { ...api, status, button, calls, responses };
}

const quality = { context: 'vtfalte/content-publish', state: 'success', description: 'Geprüft gegen master base' };
const publication = (id, state, description) => ({ id, state, description, context: 'vtfalte/publication' });

test('tracks the requested commit until live deployment succeeds', async () => {
  const ui = editor();
  ui.responses.push({ sha: 'checked-head', statuses: [quality] });
  await ui.pollPublishStatus();
  assert.equal(ui.button.disabled, false);
  assert.equal(ui.status.text, 'Bereit zur Veröffentlichung');
  ui.responses.push({}, { sha: 'checked-head', statuses: [quality, publication(1, 'pending', 'Übernommen; Live-Veröffentlichung läuft')] });
  await ui.publishStand();
  await new Promise(resolve => setImmediate(resolve));
  const request = ui.calls.find(call => call.options.method === 'POST');
  assert.equal(JSON.parse(request.options.body).client_payload.head, 'checked-head');
  assert.match(ui.calls.at(-1).url, /commits\/checked-head\/status$/);
  assert.equal(ui.button.disabled, true);
  assert.equal(ui.status.text, 'Übernommen; Live-Veröffentlichung läuft');
  ui.responses.push({ sha: 'checked-head', statuses: [publication(2, 'success', 'Live veröffentlicht')] });
  await ui.pollPublishStatus();
  assert.equal(ui.status.text, 'Live veröffentlicht');
});

test('retry ignores the previous failure and reports the new deployment failure', async () => {
  const ui = editor();
  const previous = publication(1, 'failure', 'Old failure');
  ui.responses.push({ sha: 'checked-head', statuses: [quality, previous] });
  await ui.pollPublishStatus();
  ui.responses.push({}, { sha: 'checked-head', statuses: [quality, previous] });
  await ui.publishStand();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(ui.status.text, 'Stand wird veröffentlicht …');
  ui.responses.push({ sha: 'checked-head', statuses: [publication(2, 'failure', 'Live-Veröffentlichung fehlgeschlagen')] });
  await ui.pollPublishStatus();
  assert.equal(ui.status.text, 'Live-Veröffentlichung fehlgeschlagen');
});

test('an API failure disables publication instead of retaining a stale green state', async () => {
  const ui = editor();
  ui.responses.push({ sha: 'checked-head', statuses: [quality] });
  await ui.pollPublishStatus();
  ui.responses.push(new Error('Offline'));
  await ui.pollPublishStatus();
  assert.equal(ui.button.disabled, true);
  assert.match(ui.status.text, /nicht erreichbar/);
});
