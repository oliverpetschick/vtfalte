import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gitCommand, preparePromotion, pushPromotion, promoteContent, qualityDescription } from './promote-content.mjs';

function repository(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'vt-cms-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const remote = path.join(directory, 'remote.git');
  const work = path.join(directory, 'work');
  mkdirSync(work);
  const git = gitCommand(work);
  git('init', '--bare', remote);
  git('init', '-b', 'master');
  git('config', 'user.name', 'CMS Test');
  git('config', 'user.email', 'cms-test@example.org');
  git('remote', 'add', 'origin', remote);
  const commit = (name, value) => {
    writeFileSync(path.join(work, name), value);
    git('add', name);
    git('commit', '-m', 'Test content');
    return git('rev-parse', 'HEAD');
  };
  const base = commit('content.txt', 'original');
  git('push', 'origin', 'master');
  git('checkout', '-b', 'cms-content');
  commit('content.txt', 'first edit');
  const head = commit('second.txt', 'second edit');
  git('push', 'origin', 'cms-content');
  const remoteGit = gitCommand(remote);
  remoteGit('config', 'receive.denyNonFastForwards', 'true');
  return { git, remoteGit, commit, base, head };
}

test('promotes several saves as one merge with the exact checked tree', t => {
  const { git, remoteGit, base, head } = repository(t);
  const merged = preparePromotion(git, base, head);
  pushPromotion(git, base, head, merged);
  assert.equal(remoteGit('rev-parse', 'master'), merged);
  assert.equal(remoteGit('rev-parse', 'cms-content'), merged);
  assert.equal(git('rev-parse', `${merged}^{tree}`), git('rev-parse', `${head}^{tree}`));
  assert.equal(git('show', '-s', '--format=%P', merged), `${base} ${head}`);
});

for (const branch of ['cms-content', 'master']) {
  test(`a concurrent ${branch} update aborts both ref changes without losing work`, t => {
    const { git, remoteGit, commit, base, head } = repository(t);
    const merged = preparePromotion(git, base, head);
    git('checkout', branch);
    const concurrent = commit('concurrent.txt', 'must survive');
    git('push', 'origin', branch);
    assert.throws(() => pushPromotion(git, base, head, merged));
    assert.equal(remoteGit('rev-parse', 'master'), branch === 'master' ? concurrent : base);
    assert.equal(remoteGit('rev-parse', 'cms-content'), branch === 'cms-content' ? concurrent : head);
  });
}

function api(head, base, options = {}) {
  const statuses = [];
  const dispatches = [];
  const failures = [];
  return {
    statuses, dispatches, failures,
    context: { repo: { owner: 'test', repo: 'test' }, serverUrl: 'https://github.com', runId: 1,
      payload: { client_payload: { head } } },
    core: { setFailed: message => failures.push(message) },
    github: { rest: { repos: {
      createCommitStatus: async value => { statuses.push(value); },
      getCombinedStatusForRef: async () => ({ data: { statuses: [{
        context: 'vtfalte/content-publish', state: options.state ?? 'success',
        description: qualityDescription(options.checkedBase ?? base),
      }] } }),
      createDispatchEvent: async value => {
        if (options.failDispatch) throw new Error('Dispatch unavailable');
        dispatches.push(value);
      },
    } } },
  };
}

test('even an otherwise valid fast-forward cannot use an outdated master base', t => {
  const { git, remoteGit, base, head } = repository(t);
  const merged = preparePromotion(git, base, head);
  const advanced = git('rev-parse', `${head}^`);
  remoteGit('update-ref', 'refs/heads/master', advanced);
  assert.throws(() => pushPromotion(git, base, head, merged));
  assert.equal(remoteGit('rev-parse', 'master'), advanced);
  assert.equal(remoteGit('rev-parse', 'cms-content'), head);
});

test('an empty stand cannot create a publication commit', t => {
  const { git, base } = repository(t);
  assert.throws(() => preparePromotion(git, base, base), /Kein offener Stand/);
});

test('a stale editor request never promotes a newer save', async t => {
  const { git, remoteGit, commit, base, head } = repository(t);
  const newer = commit('newer.txt', 'not requested');
  git('push', 'origin', 'cms-content');
  const mock = api(head, base);
  assert.equal(await promoteContent({ ...mock, git, enabled: true }), null);
  assert.equal(remoteGit('rev-parse', 'master'), base);
  assert.equal(remoteGit('rev-parse', 'cms-content'), newer);
  assert.equal(mock.dispatches.length, 0);
});

for (const options of [{ state: 'failure' }, { checkedBase: '0'.repeat(40) }]) {
  test(`rejects an invalid or outdated quality result: ${JSON.stringify(options)}`, async t => {
    const { git, remoteGit, base, head } = repository(t);
    const mock = api(head, base, options);
    assert.equal(await promoteContent({ ...mock, git, enabled: true }), null);
    assert.equal(remoteGit('rev-parse', 'master'), base);
    assert.equal(remoteGit('rev-parse', 'cms-content'), head);
    assert.equal(mock.dispatches.length, 0);
    assert.equal(mock.failures.length, 1);
  });
}

test('dispatch pins the deployed and requested commits without claiming live success', async t => {
  const { git, base, head } = repository(t);
  const mock = api(head, base);
  const merged = await promoteContent({ ...mock, git, enabled: true });
  assert.deepEqual(mock.dispatches[0].client_payload, { sha: merged, content_sha: head });
  assert.equal(mock.statuses.at(-1).state, 'pending');
  assert.equal(mock.statuses.some(s => s.description === 'Live veröffentlicht'), false);
});

test('disabled deployment reports only source promotion and sends no dispatch', async t => {
  const { git, base, head } = repository(t);
  const mock = api(head, base);
  await promoteContent({ ...mock, git, enabled: false });
  assert.equal(mock.dispatches.length, 0);
  assert.equal(mock.statuses.at(-1).description, 'Übernommen; Live-Veröffentlichung deaktiviert');
});

test('dispatch failure preserves the promoted content and reports a recoverable failure', async t => {
  const { git, remoteGit, base, head } = repository(t);
  const mock = api(head, base, { failDispatch: true });
  await promoteContent({ ...mock, git, enabled: true });
  const merged = remoteGit('rev-parse', 'master');
  assert.notEqual(merged, base);
  assert.equal(remoteGit('rev-parse', 'cms-content'), merged);
  assert.equal(mock.statuses.at(-1).state, 'failure');
  assert.match(mock.statuses.at(-1).description, /Deployment nicht gestartet/);
});
