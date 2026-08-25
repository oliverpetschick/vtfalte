import { execFileSync } from 'node:child_process';

const branch = process.env.HEAD_REF ?? '';
if (branch !== 'cms-content') {
  console.log('Kein CMS-Branch; die CMS-Dateigrenzen gelten nicht.');
  process.exit(0);
}

const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA ?? 'HEAD';
if (!base) {
  console.error('BASE_SHA fehlt.');
  process.exit(1);
}

const output = execFileSync('git', ['diff', '--name-status', '-z', base, head], {
  encoding: 'utf8',
});
const tokens = output.split('\0').filter(Boolean);
const changes = [];

for (let index = 0; index < tokens.length;) {
  const status = tokens[index++];
  const oldPath = tokens[index++];
  const newPath = /^[RC]/.test(status) ? tokens[index++] : oldPath;
  changes.push({ status, oldPath, newPath });
}

const locationChanges = changes.filter(({ oldPath, newPath }) =>
  oldPath.startsWith('src/content/locations/') || newPath.startsWith('src/content/locations/'),
);
const locationPaths = new Set(locationChanges.flatMap(({ oldPath, newPath }) =>
  [oldPath, newPath].filter(file => file.startsWith('src/content/locations/')),
));
const locationPath = [...locationPaths][0] ?? '';
const locationId = locationPath.split('/').at(-1)?.replace(/\.json$/, '') ?? '';
const photoPrefix = `src/images/folds/fold_${locationId}/`;
const invalid = changes.filter(({ status, oldPath, newPath }) => {
  if (oldPath === locationPath && newPath === locationPath && /^[AMD]$/.test(status)) return false;
  if (oldPath !== newPath || !newPath.startsWith(photoPrefix)) return true;
  if (!/\.(jpe?g|png)$/i.test(newPath)) return true;
  if (status === 'D') return false;
  if (status === 'A' && newPath.split('/').at(-1).startsWith('upload-')) return false;
  return true;
});

if (locationChanges.length !== 1 || locationPaths.size !== 1 || !/^src\/content\/locations\/[a-zA-Z0-9-]+\.json$/.test(locationPath) || invalid.length) {
  console.error('CMS-Prüfung fehlgeschlagen: Eine Veröffentlichung darf genau einen Eintrag und dessen Fotos ändern.');
  for (const change of invalid) {
    console.error(`- ${change.status} ${change.oldPath}${change.newPath === change.oldPath ? '' : ` -> ${change.newPath}`}`);
  }
  process.exit(1);
}

console.log(`CMS-Änderung betrifft genau ${locationPath} und dessen Fotos.`);
