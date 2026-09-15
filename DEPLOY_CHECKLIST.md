# CMS release checklist

## 1. Preserve recovery

- Confirm `gh-pages` still points to `f2d60e9` and the recovery tag
  `live-before-cleanup-2026-08-21` points to the same commit.
- Record Pages settings: `gh-pages`, `/(root)`, `www.vtfalte.de`, HTTPS enabled.
- Leave `gh-pages` unchanged throughout the CMS cutover.

## 2. Verify the candidate

- Inspect the full source diff against `691458f` and the latest local fixes.
- Run `npm ci`, `npm run check`, and `npm run validate-content -- --strict-media`.
- Compare the public routes, navigation, atlas, gallery, photos and direct links on desktop
  and mobile. Record the existing filename correction for location 54, photo 2 separately.
- Check the login page's appearance and authenticated editor behavior.
- Do not commit generated `build/`, admin vendor files or generated content manifests.

## 3. Configure the owner's login

- Follow [CMS_SETUP.md](CMS_SETUP.md). Initially only `oliverpetschick` has write access.
- Obtain approval before creating the OAuth App, Cloudflare resources or branch rules.
- Test GitHub login from the agreed local/test address before publishing `/admin/` live.
- Configure `CMS_OAUTH_URL`; keep `ENABLE_PAGES_ACTIONS` unset.

## 4. Install and test without live deployment

- Merge the verified infrastructure into `master` so repository-dispatch workflows exist
  on the default branch. Create `cms-content` from that approved commit.
- Confirm Actions can write contents and statuses. The atomic promotion needs permission
  to fast-forward both branches. Review any existing branch rules rather than disabling them.
- Save two disposable edits through the editor and wait for the green quality result.
- Click “Stand veröffentlichen”. Confirm one merge commit on `master`, an identical
  `cms-content` ref and the message “Übernommen; Live-Veröffentlichung deaktiviert”.
- Confirm no Pages deployment was requested and the live website still comes from `gh-pages`.
- Test invalid content: quality must fail and publication must be unavailable.
- Fix and remove all test content, run checks again, and review the final diff.

The CMS file-boundary validator applies to content changes after infrastructure installation,
not to the entire CMS implementation branch against the old `master`.

## 5. Cut over only after explicit approval

1. Confirm the approved clean source commit, successful checks and recovery settings.
2. Switch Pages Source to **GitHub Actions**.
3. Set `ENABLE_PAGES_ACTIONS=true`.
4. Run **Pages → Run workflow** on `master` and wait for deployment to succeed.
5. Verify `https://vtfalte.de/` redirects to `https://www.vtfalte.de/`, HTTPS, public
   routes and deployed assets, and the owner's login at `/admin/`.

Pages builds a fixed commit and checks that it is still `master` immediately before
requesting deployment. Failed builds do not upload a release. A later source change does
not alter the already built artifact. This is not a lock on all future owner actions;
stop queued/running deployments when entering recovery.

## Recovery

1. Set `ENABLE_PAGES_ACTIONS=false`; stop initiating CMS publications.
2. Cancel queued and running Pages workflows before changing the publishing source.
3. In Settings → Pages select **Deploy from a branch**, **gh-pages**, **/(root)**.
4. Confirm `www.vtfalte.de` and HTTPS, wait for deployment, then check the site and assets.

The fallback restores the frozen old website. Later CMS edits remain in the source
repository but are not automatically included in that release. Recovery takes deployment
and cache time; it is not instantaneous. It does not depend on Cloudflare being available.

## Retry without rollback

- Failed/outdated content check: run **Content Publish** manually on `master`, fix any
  reported content errors, and publish the newly checked stand.
- Promoted content but failed deployment: run **Pages** manually on `master`.
- Pending status after cancellation or an API outage: inspect the linked Actions run;
  do not treat a pending status as proof that anything is live.
