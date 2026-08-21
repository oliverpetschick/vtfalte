# CMS trial and later setup

## Sunday: full local editor trial

No new account is required. On the computer containing this repository:

```sh
npm ci
npm run dev
```

Open:

- public site: http://localhost:3000/
- editor: http://localhost:3000/admin/

The editor uses Decap's local backend. It can create and edit locations, preview coordinates on a map, reorder or remove photos, and process new JPEG/PNG uploads. Changes are written only to this working tree. It does not push, open pull requests, merge, or deploy.

Before the trial, use disposable copies of photos where practical. Afterward, inspect everything with `git status --short` and `git diff`. Restore trial content only after confirming the exact paths; do not reset the whole worktree because it also contains the CMS implementation.

Each location is saved separately. She can save five locations in succession; none affects the live page. Removing a photo removes it from that location. After reviewing the edits, `npm run prune-media` deletes unreferenced location-photo files from the current tree; Git history still provides recovery.

The local trial intentionally differs in two places: there is no GitHub login, and “publish” writes local files instead of creating a reviewable GitHub pull request. Those require the online setup below.

## Accounts needed only after approval

1. Girlfriend: one free personal GitHub account.
2. Repository owner: the existing personal GitHub account, with admin access to `oliverpetschick/vtfalte`.
3. OAuth proxy: one free Cloudflare account. It can be the owner's existing account; the editor does not need its credentials.

No paid CMS, database, image host, Netlify account, or separate map account is required. Map preview tiles come from OpenStreetMap.

## Online setup after approval

Do these only after the local editor is accepted:

1. Add the editor's GitHub account as a repository collaborator with write access.
2. Protect `master`: require pull requests, require the `quality` check, and block force-pushes and branch deletion.
3. Create a GitHub OAuth App. Use the proxy URL as its homepage and `<proxy-url>/callback` as its callback URL.
4. Deploy the open-source `sterlingwes/decap-proxy` to a Cloudflare Worker. Store `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` as Worker secrets. Never commit them here.
5. Add the repository Actions variable `CMS_OAUTH_URL` containing the HTTPS proxy URL without a trailing slash.
6. Test `/admin/` login and a disposable CMS pull request while Pages still publishes `gh-pages`.
7. Only after that test passes, switch Settings → Pages → Source from “Deploy from a branch” to “GitHub Actions”.

The OAuth token requests `public_repo`, so the editor should use a personal GitHub account intended for this work. Repository permission remains the primary access control.

## Publishing and recovery

CMS publishing creates a branch and pull request; it does not directly change the live page. Validation, tests, and a production build must pass before merge. The deployment workflow is intentionally not part of this trial branch; design and add it only after editor approval, then explicitly switch Pages to GitHub Actions.

If the first Actions deployment is wrong, switch Settings → Pages → Source back to “Deploy from a branch”, select `gh-pages` and `/(root)`, and verify https://www.vtfalte.de/. The untouched release branch and `live-before-cleanup-2026-08-21` tag remain recovery points.

Known preserved legacy issue: location 54 references `54_2_Johanna-Knigge.jpg`, while the historical file uses a dash. Validation reports this but intentionally does not alter current public behavior.
