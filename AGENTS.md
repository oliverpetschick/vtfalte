# Repository Working Agreement

## Coding style

- Keep implementations KISS: prefer the simplest correct design.
- Keep comments terse and technical. Comment only non-obvious constraints or safety behavior.

## Production safety

- `gh-pages` is the production branch. It is published from `/(root)` at https://www.vtfalte.de/.
- Do not edit, commit to, merge into, force-update, or push `gh-pages` without explicit user approval.
- Do not run `npm run deploy` or otherwise trigger a GitHub Pages deployment without explicit user approval.
- `master` is the source branch. Perform work on a dedicated branch created from `master`.
- The working branch for the current cleanup is `chore/non-ui-cleanup`.

## Change boundary

- Do not make visual changes or alter user-facing behavior, content, navigation, layout, styling, or assets.
- Keep changes limited to non-UI internals, tests, tooling, documentation, and release safety.
- Treat changes under `src/` or `public/` as potentially user-facing. Verify necessity and output equivalence before modifying them.
- Do not include generated `build/` output in source commits.
- Keep `public/CNAME` set to `www.vtfalte.de` when correcting the release setup; do not change the domain.

## Verification and recovery

- Before any future release, run tests and a production build, inspect the full diff, and verify that no unintended UI change occurred.
- After any approved release operation, verify https://www.vtfalte.de/ and its deployed assets.
- The verified live source is commit `fa3a416`.
- The verified live release is commit `f2d60e9` on `gh-pages`.
- Recovery tags are `backup-master-before-vt2-2026-08-21` and `live-before-cleanup-2026-08-21`.
- The legacy Jest suite currently requires a `URL.createObjectURL` test-environment mock before it can load MapLibre.
