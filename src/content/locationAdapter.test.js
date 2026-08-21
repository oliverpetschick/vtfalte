import legacyData from '../testFixtures/legacy-data.json';
import { data } from './index';

test('migrated locations preserve the public GeoJSON', () => {
  expect(data).toEqual(legacyData);
});

test('all legacy IDs remain ordered and unique', () => {
  const ids = data.features.map(feature => feature.properties.id);
  expect(ids).toEqual(Array.from({ length: 102 }, (_, index) => index + 1));
  expect(new Set(ids).size).toBe(ids.length);
});
