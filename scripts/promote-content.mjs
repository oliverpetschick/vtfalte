import { execFileSync } from 'node:child_process';

export const qualityDescription = base => `Geprüft gegen master ${base}`;

export function gitCommand(cwd = process.cwd()) {
  return (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
}

export function preparePromotion(git, base, head) {
  git('merge-base', '--is-ancestor', base, head);
  const tree = git('rev-parse', `${head}^{tree}`);
  if (tree === git('rev-parse', `${base}^{tree}`)) throw new Error('Kein offener Stand.');
  return git('commit-tree', tree, '-p', base, '-p', head, '-m', 'Publish content stand');
}

export function pushPromotion(git, base, head, merged) {
  // Both refs must still match the checked values; update both or neither.
  git('merge-base', '--is-ancestor', base, merged);
  git('merge-base', '--is-ancestor', head, merged);
  git('push', '--atomic', `--force-with-lease=refs/heads/master:${base}`,
    `--force-with-lease=refs/heads/cms-content:${head}`, 'origin',
    `${merged}:refs/heads/master`, `${merged}:refs/heads/cms-content`);
}

export async function promoteContent({ github, context, core, git = gitCommand(), enabled }) {
  const repo = context.repo;
  const target_url = `${context.serverUrl}/${repo.owner}/${repo.repo}/actions/runs/${context.runId}`;
  const requested = context.payload.client_payload?.head;
  if (!/^[a-f0-9]{40}$/.test(requested ?? '')) throw new Error('Geprüfter Stand fehlt. Bitte neu laden.');
  const status = (sha, state, description) => github.rest.repos.createCommitStatus({
    ...repo, sha, state, description, context: 'vtfalte/publication', target_url,
  });
  let merged;
  try {
    await status(requested, 'pending', 'Übernahme wird geprüft');
    git('fetch', 'origin', '+refs/heads/master:refs/remotes/origin/master',
      '+refs/heads/cms-content:refs/remotes/origin/cms-content');
    const base = git('rev-parse', 'origin/master');
    const head = git('rev-parse', 'origin/cms-content');
    if (head !== requested) throw new Error('Stand wurde geändert. Bitte aktuellen Stand prüfen und erneut veröffentlichen.');
    const combined = await github.rest.repos.getCombinedStatusForRef({ ...repo, ref: head });
    const check = combined.data.statuses.find(s => s.context === 'vtfalte/content-publish');
    if (check?.state !== 'success' || check.description !== qualityDescription(base)) {
      throw new Error('Stand muss gegen den aktuellen master erneut geprüft werden.');
    }
    const candidate = preparePromotion(git, base, head);
    pushPromotion(git, base, head, candidate);
    merged = candidate;
    await github.rest.repos.createCommitStatus({ ...repo, sha: merged, state: 'success',
      context: 'vtfalte/content-publish', description: 'Keine offenen Inhaltsänderungen', target_url });
    if (!enabled) {
      for (const sha of [requested, merged]) await status(sha, 'success', 'Übernommen; Live-Veröffentlichung deaktiviert');
      return merged;
    }
    for (const sha of [requested, merged]) await status(sha, 'pending', 'Übernommen; Live-Veröffentlichung läuft');
    await github.rest.repos.createDispatchEvent({ ...repo, event_type: 'deploy-pages',
      client_payload: { sha: merged, content_sha: requested } });
    return merged;
  } catch (error) {
    const description = merged
      ? 'Übernommen; Deployment nicht gestartet. Pages für master erneut ausführen.'
      : 'Übernahme nicht bestätigt. Stand prüfen und gegebenenfalls erneut veröffentlichen.';
    for (const sha of [requested, merged].filter(Boolean)) await status(sha, 'failure', description);
    core.setFailed(error.message);
    return null;
  }
}
