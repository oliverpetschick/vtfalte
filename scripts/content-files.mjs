import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const root = process.cwd();
export const locationsDirectory = path.join(root, 'src/content/locations');
export const legacyPhotoAliases = new Map([
  [
    'images/folds/fold_54/54_2_Johanna-Knigge.jpg',
    'images/folds/fold_54/54-2_Johanna-Knigge.jpg',
  ],
]);

export const walk = async directory => {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const files = await Promise.all(
    entries.map(entry => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    }),
  );
  return files.flat();
};

export const loadLocations = async () => {
  const files = (await walk(locationsDirectory))
    .filter(file => file.endsWith('.json'))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  return Promise.all(
    files.map(async file => ({
      file,
      id: path.basename(file, '.json'),
      location: JSON.parse(await readFile(file, 'utf8')),
    })),
  );
};

export const referencedPhotos = locations => {
  const references = new Set();
  for (const { location } of locations) {
    for (const photo of location.photos ?? []) {
      references.add(path.join(root, 'src', photo.src));
      const alias = legacyPhotoAliases.get(photo.src);
      if (alias) references.add(path.join(root, 'src', alias));
    }
  }
  return references;
};
