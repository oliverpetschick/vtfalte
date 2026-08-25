# CMS trial and later setup

## Sunday: local editor trial

No account is required:

```sh
npm ci
npm run dev
```

Open the site at http://localhost:3000/ and the editor at http://localhost:3000/admin/.
Choose "Lokal öffnen". Saving updates only this working tree and refreshes the local site.
It never pushes, merges, or deploys.

After the trial, inspect changes with `git status --short` and `git diff`. Do not reset
the whole working tree because it also contains the CMS implementation.

## Accounts needed after approval

- One free personal GitHub account for the editor, with write access to this repository.
- The owner's existing GitHub account with repository admin access.
- One free Cloudflare account for the OAuth proxy.

No paid CMS, database, image host, Netlify account, or map account is required.

## Online setup after approval

1. Add the editor's GitHub account as a repository collaborator.
2. Create `cms-content` from the approved `master` commit.
3. Create a GitHub OAuth App.
4. Deploy the open-source `sterlingwes/decap-proxy` as a Cloudflare Worker.
5. Store the proxy URL in the repository variable `CMS_OAUTH_URL`.
6. Protect `master` and require `Content Publish / content-quality`.
7. Test one disposable CMS publication while Pages still uses `gh-pages`.
8. Switch Pages to GitHub Actions.
9. Set `ENABLE_PAGES_ACTIONS=true` and manually run the Pages workflow once.

## Publishing and recovery

The editor works on an accumulating "Stand" (working state): every save writes one or more
location changes to `cms-content` and they pile up there. Saving no longer publishes anything
on its own.

Each save triggers `content-publish.yml` (Gate 1). It merges the current `master`, removes
unused photos, checks that only locations and their photos changed (`validate-cms-pr`, now one
or more entries), validates the content, runs tests, and builds the production site. The result
is the commit status `vtfalte/content-publish`: green means the whole Stand is publishable, red
means it must be fixed first. Nothing is merged into `master` at this point.

When the Stand is green, the editor clicks "Stand veröffentlichen". The button fires a
`publish-stand` dispatch that runs `content-promote.yml` (Gate 2): it re-checks the green status,
merges `cms-content` into `master` as one commit, resets `cms-content` onto the published state,
and starts Pages. If the Stand is red the button stays disabled, so `master` cannot receive a bad
Stand. There is no auto-rollback: a red Stand simply stays on `cms-content` for the editor to fix.

Gate 3 is the deploy itself: `pages.yml` re-validates and rebuilds before publishing and only
uploads the built artifact. A failing build does not deploy, so the last good live site stays up —
CMS content can never break https://www.vtfalte.de/.

The Pages workflow stays disabled until `ENABLE_PAGES_ACTIONS=true` is set. No workflow modifies
or deletes `gh-pages`. To recover, set Pages back to "Deploy from a branch", choose `gh-pages`
and `/(root)`, then verify https://www.vtfalte.de/.
