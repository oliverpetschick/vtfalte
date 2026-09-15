import { categories, categoryIds } from './categories';
import { buildFeatureCollection } from './locationAdapter';

const entry = (filename, overrides = {}) => ({
  filename,
  location: {
    category: 'Sporthalle', coordinates: { longitude: 12.3, latitude: 51.3 },
    address: 'Testadresse', photos: [], links: [], ...overrides,
  },
});

test('maps editable content, uploaded photos and links to public fields', () => {
  const { features } = buildFeatureCollection([entry('7.json', {
    usage: 'Neue Nutzung', formerUsage: 'Alte Nutzung', condition: 'Gut',
    photos: [{ src: 'images/folds/fold_7/upload-test.jpg', credit: 'Anna von Beispiel' }],
    links: [{ url: 'https://example.org/' }],
  })]);
  expect(features[0]).toEqual({
    type: 'Feature', geometry: { type: 'Point', coordinates: [12.3, 51.3] },
    properties: {
      id: 7, category_id: 1, address: 'Testadresse', type: '', useage: 'Neue Nutzung',
      former_useage: 'Alte Nutzung', condition: 'Gut',
      images: { image_0: { src: 'images/folds/fold_7/upload-test.jpg',
        author_firstname: 'Anna', author_lastname: 'von Beispiel' } },
      links: { link_0: { url: 'https://example.org/' } },
    },
  });
});

test('supports new IDs, deleted entries, gallery order and missing photos', () => {
  const records = [entry('7.json', { galleryOrder: 2 }),
    entry('20260915-neu.json', { galleryOrder: 1 }), entry('9.json')];
  expect(buildFeatureCollection(records).features.map(f => f.properties.id))
    .toEqual(['20260915-neu', 7, 9]);
  const remaining = buildFeatureCollection(records.filter(r => r.filename !== '7.json'));
  expect(remaining.features.map(f => f.properties.id)).toEqual(['20260915-neu', 9]);
  expect(remaining.features[0].properties.images.image_0.src).toBe('images/placeholder.jpg');
  expect(remaining.features[0].properties.links).toBeNull();
  expect(buildFeatureCollection([])).toEqual({ type: 'FeatureCollection', features: [] });
});

test('all CMS categories map to the stable public IDs', () => {
  expect(categories.map(category => category.label)).toEqual([
    'Sporthalle', 'Jugendclub', 'Senior*innenzentrum', 'Kaufhalle',
    'Gleichrichterunterwerk', 'Umformerstation', 'Mehrzweckhalle/Individualbau', 'Abriss',
  ]);
  expect(categories.map(({ label }) => categoryIds[label])).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
});
