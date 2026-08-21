import { execFileSync } from 'node:child_process';

const branch = process.env.HEAD_REF ?? '';
if (!branch.startsWith('cms/')) {
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
const invalid = changes.filter(({ status, newPath }) => {
  if (/^[AM]$/.test(status) && newPath.startsWith('src/content/locations/')) return false;
  if (status === 'A' && newPath.startsWith('src/images/uploads/')) return false;
  return true;
});

if (locationChanges.length !== 1 || invalid.length) {
  console.error('CMS-Prüfung fehlgeschlagen: Ein CMS-PR darf genau einen Standort und nur neue Uploads ändern.');
  for (const change of invalid) {
    console.error(`- ${change.status} ${change.oldPath}${change.newPath === change.oldPath ? '' : ` -> ${change.newPath}`}`);
  }
  process.exit(1);
}

console.log('CMS-PR ändert genau einen Standort und ausschließlich neue Uploads.');
