import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fixturePath = path.join(root, 'src/testFixtures/legacy-data.json');
const locationsPath = path.join(root, 'src/content/locations');
const legacy = JSON.parse(await readFile(fixturePath, 'utf8'));
const categories = [
  'Sporthalle',
  'Jugendclub',
  'Senior*innenzentrum',
  'Kaufhalle',
  'Gleichrichterunterwerk',
  'Umformerstation',
  'Mehrzweckhalle/Individualbau',
  'Abriss',
];

const normalizedPhotoPath = (id, index, source) => {
  const extension = path.posix.extname(source).toLowerCase();
  const suffix = path.posix.basename(source, extension)
    .replace(/^[0-9]+[-_][0-9]+[-_]?/, '')
    .replace(/^upload-[^-]+-[^-]+-/, '') || 'Foto';
  return 'images/folds/fold_' + id + '/' + id + '_' + (index + 1) + '_' + suffix + extension;
};

await mkdir(locationsPath, { recursive: true });

for (const [index, feature] of legacy.features.entries()) {
  const { properties, geometry } = feature;
  const photos = Object.values(properties.images ?? {})
    .filter(image => image.src !== 'images/placeholder.jpg')
    .map((image, photoIndex) => ({
      src: normalizedPhotoPath(properties.id, photoIndex, image.src),
      credit: `${image.author_firstname} ${image.author_lastname}`.trim(),
    }));
  const links = Object.values(properties.links ?? {}).map(link => ({ url: link.url }));
  const location = {
    title: properties.address || `Standort ${properties.id}`,
    galleryOrder: index + 1,
    category: categories[properties.category_id - 1],
    coordinates: {
      longitude: geometry.coordinates[0],
      latitude: geometry.coordinates[1],
    },
    address: properties.address ?? '',
    type: properties.type ?? '',
    usage: properties.useage ?? '',
    formerUsage: properties.former_useage ?? '',
    condition: properties.condition ?? '',
    photos,
    links,
  };

  await writeFile(
    path.join(locationsPath, `${properties.id}.json`),
    `${JSON.stringify(location, null, 2)}\n`,
  );
}

console.log(`Migrated ${legacy.features.length} locations.`);
