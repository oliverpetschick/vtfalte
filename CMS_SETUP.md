# CMS setup

## Current scope

Only the owner, `oliverpetschick`, will edit content initially. No collaborator is needed.
The public website remains on GitHub Pages. Cloudflare hosts only the OAuth proxy.
The editor's login page is public; GitHub repository permissions control write access.
`/admin/` has `noindex, nofollow` and is not linked from the public navigation.

## Local trial

```sh
npm ci
npm run dev
```

Website: http://localhost:3000/ — editor: http://localhost:3000/admin/.
“Lokal öffnen” and “Lokal speichern” affect local files only. They never push or deploy.

For the GitHub integration trial, start only the app with `CMS_OAUTH_URL` set and open
`http://localhost:3000/admin/?online=1`. Do not run `decap-server` during this trial.

## Online setup, after approval

1. Follow [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) for verification and release order.
2. Create the owner's Cloudflare account, a GitHub OAuth App and the OAuth proxy Worker.
3. Use `workers/cms-auth.mjs` as the Worker entry point. Its callback URL is
   `https://vtfalte-cms-auth.oliver-petschick.workers.dev/callback`.
4. Store credentials as Worker secrets and the HTTPS proxy URL as `CMS_OAUTH_URL`.
5. Merge the checked CMS infrastructure into `master`, then create `cms-content` from it.
6. Keep Pages on `gh-pages` and `ENABLE_PAGES_ACTIONS` unset during the online trial.

No database or additional editor account is required. Do not create resources or change
repository rules until the user approves the concrete setup.

## Save and publish

Saving commits content to `cms-content`. Content Publish normalizes that branch against
`master`, validates its allowed files and media, runs tests, and builds the website.
Its `vtfalte/content-publish` status records the exact checked `master` commit.
Adapter unit tests use fixed fixtures, so valid edits do not need to match the old live data.

“Stand veröffentlichen” submits the displayed content commit. Content Promote verifies
that commit and its checked base, creates one merge commit with the exact checked tree,
and updates `master` and `cms-content` in one atomic Git push. Both refs must still match
those verified values. Concurrent changes cause the entire push to fail without losing work.
There is no unconditional branch reset and no automatic PR merge.

The workflow token needs `contents: write` and `statuses: write`. Any branch rules must
permit this checked, fast-forward workflow update; a blanket PR-only rule blocks it.
Do not install the former `Content Publish / content-quality` required-check recipe.

`vtfalte/publication` is separate from content quality. With Pages disabled, the editor
reports “Übernommen; Live-Veröffentlichung deaktiviert”. With Pages enabled, the dispatch
pins the exact release commit. Only a successful Pages deployment reports “Live veröffentlicht”.
The editor tracks the requested commit even when newer content is saved.

If the base has changed or normalization failed, run **Content Publish → Run workflow**
on `master`, wait for the new quality result, then publish again. If content was already
promoted but deployment failed, run **Pages → Run workflow** on `master`; no content reset
or second promotion is needed. Inspect the linked workflow if a status remains pending.

Production cutover and recovery are described in [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md).

## Authentication Worker

The standalone module in `workers/cms-auth.mjs` has no package dependencies. Paste its
contents into the Cloudflare Worker editor, replacing the Hello World code.
It uses the `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` secrets already stored there.

The Worker validates OAuth state and PKCE, checks the returned GitHub identity against
`oliverpetschick`, and sends the Decap response only to the allowed opener origins:
`https://www.vtfalte.de` and `http://localhost:3000` for the online login trial.
Remove the localhost origin after completing that trial. Adding another editor later
requires updating both the account allowlist in this Worker and repository permissions.

The upstream `sterlingwes/decap-proxy` was reviewed as the initial setup reference.
Its unchecked callback state and wildcard token response are not used here.
The implementation follows GitHub's authorization flow:
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

The root URL returns `VT-Falte CMS authentication service`. This confirms the code is
served, not that the complete OAuth flow has passed. Test the login from the CMS popup.
Keep wildcard redirects, device flow and expiring tokens disabled in this OAuth App;
this editor setup does not implement token refresh.
