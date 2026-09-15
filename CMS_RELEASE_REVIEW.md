# CMS release review — 2026-09-15

## Result

The identified code issues are corrected on `master` and `feat/content-cms`.
The owner completed the OAuth setup, accepted the local public preview and completed
the Decap save, validation and promotion trial.
The production branch and deployed website remain unchanged.

## Changes

- Adapter tests use fixed data rather than requiring all future CMS content to match
  the old 102 entries. They cover text, upload paths, new IDs, deletion and ordering.
- Promotion verifies the requested content SHA and its exact checked `master` base.
  It creates a merge commit with the checked content tree and atomically advances both
  branches. Explicit expected refs and ancestry checks prevent concurrent work from
  being overwritten. No automatic PR or unconditional reset is involved.
- Content quality and publication have separate commit statuses. The editor pins the
  requested SHA while waiting; a previous failed attempt cannot end a new retry.
- Pages builds the requested release SHA and rejects a superseded candidate before
  deployment. Only a successful deployment produces “Live veröffentlicht”. Disabled
  deployment and failed deployment requests have distinct messages.
- MapLibre is pinned to 6.9.1 to fix GHSA-jrc7-96c5-q579. Its ESM worker and shared
  module are copied from the installed package during local start and production build.
  The Atlas uses the required worker URL and MapLibre 6 GeoJSON property behavior.
- Content checks can be restarted manually. A promoted release can be deployed again
  with the Pages workflow without resetting or republishing content.
- Setup and recovery instructions now describe this actual workflow.

## Verification

- `npm run check`: passed after the MapLibre migration, including 36 CMS tests,
  4 React/Jest tests and the production build.
- `npm run validate-content -- --strict-media`: 102 valid locations, no new uploads.
- `npm run test:admin`: covers actual atomic Git pushes in temporary local repositories,
  concurrent changes to either branch, stale editor requests and quality results,
  disabled deployment, dispatch failure, deployment results and editor status handling.
- Git tests also enable `receive.denyNonFastForwards` on the temporary remote: the
  successful promotion preserves history despite using explicit leases.
- The production build contains both required MapLibre worker modules. The security
  upgrade changes the generated JavaScript and CSS bundles; the owner accepted the Atlas
  appearance and interactions against the live site.
- JavaScript syntax, workflow YAML/shell syntax and `git diff --check` checked locally.
- Existing CRA/Browserslist and React Native Web warnings remain. The final full test
  run completed without the intermittent worker-exit warning seen in earlier runs.

These checks use the installed local dependencies. GitHub Actions also completed the
real repository validation and promotion flow with Pages deployment disabled.

## Baseline and recovery

- Source baseline: `691458f72e76ba6b5131c036961304ef8a3f5e2b`.
- CMS baseline before fixes: `ac0495f77c627ffe120b9b04887a0938e6256e4b`.
- Frozen release: `f2d60e99d43e1409423fb2c936d4c1a0f2631c5a` on `gh-pages` and tag
  `live-before-cleanup-2026-08-21`.
- User confirmed `gh-pages` / `/(root)`, `www.vtfalte.de`, HTTPS and sole owner access.
- `CMS_OAUTH_URL` is configured. `ENABLE_PAGES_ACTIONS` remains absent so CMS promotion
  cannot deploy the website.
- `master` and `cms-content` contain the verified content stand from `fbd094a`.
- `gh-pages` remains at frozen release `f2d60e9`; the live HTML matches that release.

Before these fixes, 137 referenced photos were compared byte for byte against the
source baseline, with no differences, including 17 renamed paths. Location 54's second
photo is the exception: the old data referenced an underscore while the old filename
used a hyphen. The CMS branch already corrects the name without changing image bytes.
This existing behavior correction requires explicit visual acceptance.

## Remaining release gates

1. Complete the remaining public mobile checks and accept the location 54 correction
   separately.
2. Obtain explicit cutover approval and follow [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md).

The recovery procedure disables new releases, cancels queued/running deployments and
returns Pages to `gh-pages` / `/(root)`. It preserves the frozen old site, not future CMS
edits, and requires deployment/cache time. GitHub failures can delay recovery; Cloudflare
is not required to serve the fallback website.

## Setup progress

The owner accepted the public local preview, Atlas interactions and the admin
image-background correction.
The owner created `vtfalte-cms-auth.oliver-petschick.workers.dev`, registered the GitHub
OAuth App, stored both Worker secrets and accepted the real OAuth login flow.

The authentication module has five passing tests for state/PKCE, account rejection,
restricted token delivery and upstream failures. No Worker code was deployed by the
agent.

The owner deployed the authentication Worker; its root response was verified over HTTPS.
The owner confirmed that the login-only probe succeeded: GitHub authentication and
repository write permission were verified without modifying repository contents.
The temporary `public/admin/vendor/login-test.html` probe was removed after that test.
The CMS infrastructure is installed on `master` and `cms-content`. The first promotion
trial stopped safely because an Octokit method name was outdated. After that method was
corrected, the online retry promoted the valid stand without deploying Pages. A duplicate
gallery position then failed validation as expected; restoring position 102 validated and
promoted successfully. The test field was also restored to its original empty value.
