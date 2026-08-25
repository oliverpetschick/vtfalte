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

"Veröffentlichen" writes one location change to `cms-content`. The pipeline permits only
that location and its photos, removes unused photos, validates the content, runs tests,
and builds the production site. On success it merges into `master` and starts Pages.

On failure it restores `cms-content` to the current `master` tree with a normal commit.
The public page and `master` remain unchanged.

The Pages workflow stays disabled until `ENABLE_PAGES_ACTIONS=true` is set. Neither
workflow modifies or deletes `gh-pages`. To recover, set Pages back to "Deploy from a
branch", choose `gh-pages` and `/(root)`, then verify https://www.vtfalte.de/.
