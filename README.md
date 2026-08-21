# VT-Falte

Source for https://www.vtfalte.de/.

```sh
npm ci
npm start
npm run build
```

- `master` is the source branch.
- `gh-pages` is generated release output; do not edit it manually.
- `npm run deploy` builds and publishes to `gh-pages`.
- Before deploying, verify the build, diff, and `build/CNAME`.

See `AGENTS.md` for the repository safety rules.
