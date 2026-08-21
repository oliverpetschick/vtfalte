import { rm } from 'node:fs/promises';
import path from 'node:path';
import { loadLocations, referencedPhotos, root, walk } from './content-files.mjs';

const locations = await loadLocations();
const referenced = referencedPhotos(locations);
const photoDirectories = [
  path.join(root, 'src/images/folds'),
  path.join(root, 'src/images/uploads'),
];
const candidates = (await Promise.all(photoDirectories.map(walk)))
  .flat()
  .filter(file => /\.(jpe?g|png)$/i.test(file));
const unused = candidates.filter(file => !referenced.has(file));

if (process.argv.includes('--check')) {
  if (unused.length) {
    console.error(unused.map(file => path.relative(root, file)).join('\n'));
    process.exit(1);
  }
  console.log('Keine ungenutzten Standortfotos gefunden.');
  process.exit(0);
}

for (const file of unused) await rm(file);
console.log(`${unused.length} ungenutzte Standortfotos entfernt.`);
