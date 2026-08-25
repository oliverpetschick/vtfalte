import { execFileSync } from 'node:child_process';

const locationPattern = /^src\/content\/locations\/[a-zA-Z0-9-]+\.json$/;

// Prüft eine Liste von Diff-Änderungen ({ status, oldPath, newPath }) gegen die
// CMS-Grenzen: Eine Veröffentlichung darf einen oder mehrere Standort-Einträge und
// ausschließlich deren Fotos (im jeweiligen fold_<id>/) betreffen.
export function evaluateCmsChanges(changes) {
  const locationChanges = changes.filter(({ oldPath, newPath }) =>
    oldPath.startsWith('src/content/locations/') || newPath.startsWith('src/content/locations/'),
  );
  const locationPaths = new Set(locationChanges.flatMap(({ oldPath, newPath }) =>
    [oldPath, newPath].filter(file => file.startsWith('src/content/locations/')),
  ));
  const validLocationPaths = [...locationPaths].filter(path => locationPattern.test(path));

  // Erlaubte Foto-Präfixe: fold_<id>/ für jeden im Diff geänderten Eintrag.
  const foldPrefixes = validLocationPaths.map(path =>
    `src/images/folds/fold_${path.split('/').at(-1).replace(/\.json$/, '')}/`,
  );

  const invalid = changes.filter(({ status, oldPath, newPath }) => {
    // Gültige Eintragsänderung: In-Place Add/Modify/Delete eines gültigen Standort-Pfads.
    if (oldPath === newPath && locationPattern.test(newPath) && /^[AMD]$/.test(status)) return false;
    // Gültige Fotoänderung: im fold_<id>/ eines geänderten Eintrags, gelöscht oder als upload-* neu.
    if (oldPath !== newPath || !foldPrefixes.some(prefix => newPath.startsWith(prefix))) return true;
    if (!/\.(jpe?g|png)$/i.test(newPath)) return true;
    if (status === 'D') return false;
    if (status === 'A' && newPath.split('/').at(-1).startsWith('upload-')) return false;
    return true;
  });

  const ok = locationPaths.size >= 1 && validLocationPaths.length === locationPaths.size && invalid.length === 0;
  return { ok, invalid, locationCount: validLocationPaths.length };
}

function parseNameStatus(output) {
  const tokens = output.split('\0').filter(Boolean);
  const changes = [];
  for (let index = 0; index < tokens.length;) {
    const status = tokens[index++];
    const oldPath = tokens[index++];
    const newPath = /^[RC]/.test(status) ? tokens[index++] : oldPath;
    changes.push({ status, oldPath, newPath });
  }
  return changes;
}

function main() {
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

  const output = execFileSync('git', ['diff', '--name-status', '-z', base, head], { encoding: 'utf8' });
  const changes = parseNameStatus(output);
  const { ok, invalid, locationCount } = evaluateCmsChanges(changes);

  if (!ok) {
    console.error('CMS-Prüfung fehlgeschlagen: Eine Veröffentlichung darf nur Standort-Einträge und deren Fotos ändern.');
    for (const change of invalid) {
      console.error(`- ${change.status} ${change.oldPath}${change.newPath === change.oldPath ? '' : ` -> ${change.newPath}`}`);
    }
    process.exit(1);
  }

  console.log(`CMS-Änderung betrifft ${locationCount} Eintrag/Einträge und deren Fotos.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
