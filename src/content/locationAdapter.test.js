import legacyData from '../testFixtures/legacy-data.json';
import { categories, categoryIds } from './categories';
import { data } from './index';

const withoutPhotoPaths = collection => ({
  ...collection,
  features: collection.features.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      images: Object.fromEntries(Object.entries(feature.properties.images).map(([key, image]) => [
        key, { ...image, src: '__photo__' },
      ])),
    },
  })),
});

test('migrated locations preserve public data and photo assignments', () => {
  expect(withoutPhotoPaths(data)).toEqual(withoutPhotoPaths(legacyData));
  for (const feature of data.features) {
    for (const image of Object.values(feature.properties.images)) {
      if (image.src === 'images/placeholder.jpg') continue;
      const prefix = 'images/folds/fold_' + feature.properties.id + '/' + feature.properties.id + '_';
      expect(image.src.startsWith(prefix)).toBe(true);
    }
  }
});

test('all legacy IDs remain ordered and unique', () => {
  const ids = data.features.map(feature => feature.properties.id);
  expect(ids).toEqual(Array.from({ length: 102 }, (_, index) => index + 1));
  expect(new Set(ids).size).toBe(ids.length);
});

test('all CMS categories map to the stable public IDs', () => {
  expect(categories.map(category => category.label)).toEqual([
    'Sporthalle', 'Jugendclub', 'Senior*innenzentrum', 'Kaufhalle',
    'Gleichrichterunterwerk', 'Umformerstation', 'Mehrzweckhalle/Individualbau', 'Abriss',
  ]);
  expect(categories.map(({ label }) => categoryIds[label])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
