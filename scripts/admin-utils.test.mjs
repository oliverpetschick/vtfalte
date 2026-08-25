import assert from 'node:assert/strict';
import test from 'node:test';
import utils from '../public/admin/admin-utils.js';

test('Google coordinates use latitude before longitude', () => {
  assert.deepEqual(utils.parseGoogleCoordinates('51.3397, 12.3731'), {
    latitude: 51.3397,
    longitude: 12.3731,
  });
});

test('coordinate parser accepts signed values and whitespace without regional limits', () => {
  assert.deepEqual(utils.parseGoogleCoordinates('  -33.8688, 151.2093  '), {
    latitude: -33.8688,
    longitude: 151.2093,
  });
  assert.deepEqual(utils.parseGoogleCoordinates('95, 220'), {
    latitude: 95,
    longitude: 220,
  });
});

test('coordinate parser rejects incomplete input', () => {
  assert.equal(utils.parseGoogleCoordinates('51.3397'), null);
  assert.equal(utils.parseGoogleCoordinates('51,3397, 12,3731'), null);
  assert.equal(utils.parseGoogleCoordinates('Leipzig'), null);
});
