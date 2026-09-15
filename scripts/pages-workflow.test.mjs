import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const workflow = yaml.load(readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8'));
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

for (const result of ['success', 'failure', 'skipped', 'cancelled']) {
  test(`Pages reports ${result} for both the release and the requested content`, async () => {
    const statuses = [];
    const script = workflow.jobs.report.steps[0].with.script;
    await new AsyncFunction('github', 'context', 'process', script)(
      { rest: { repos: { createCommitStatus: async value => statuses.push(value) } } },
      { repo: { owner: 'test', repo: 'test' }, serverUrl: 'https://github.com', runId: 7 },
      { env: { RELEASE_SHA: 'release', CONTENT_SHA: 'content', DEPLOY_RESULT: result } },
    );
    assert.deepEqual(statuses.map(s => s.sha), ['release', 'content']);
    assert.ok(statuses.every(s => s.state === (result === 'success' ? 'success' : 'failure')));
    assert.ok(statuses.every(s => (s.description === 'Live veröffentlicht') === (result === 'success')));
  });
}

test('Pages refuses to deploy a superseded release', async () => {
  const script = workflow.jobs.deploy.steps[0].with.script;
  const run = new AsyncFunction('github', 'context', 'process', script);
  const github = { rest: { git: { getRef: async () => ({ data: { object: { sha: 'current' } } }) } } };
  await assert.rejects(run(github, { repo: {} }, { env: { RELEASE_SHA: 'old' } }), /master/);
  await run(github, { repo: {} }, { env: { RELEASE_SHA: 'current' } });
});

test('release reporting also runs after a failed build', () => {
  assert.deepEqual(workflow.jobs.report.needs, ['build', 'deploy']);
  assert.match(workflow.jobs.report.if, /^always\(\)/);
  assert.equal(workflow.jobs.build.outputs.sha, '${{ steps.revision.outputs.sha }}');
});
