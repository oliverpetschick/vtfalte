import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateCmsChanges } from './validate-cms-pr.mjs';

const change = (status, oldPath, newPath = oldPath) => ({ status, oldPath, newPath });
const entry = id => `src/content/locations/${id}.json`;
const photo = (id, name) => `src/images/folds/fold_${id}/${name}`;

test('erlaubt einen einzelnen Eintrag mit Foto', () => {
  const result = evaluateCmsChanges([
    change('A', entry('20260825-120000-a')),
    change('A', photo('20260825-120000-a', 'upload-1-abc-foto.jpg')),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.locationCount, 1);
});

test('erlaubt mehrere Einträge mit ihren Fotos (Stand-Modell)', () => {
  const result = evaluateCmsChanges([
    change('A', entry('20260825-120000-a')),
    change('A', photo('20260825-120000-a', 'upload-1-abc-foto.jpg')),
    change('M', entry('20260825-130000-b')),
    change('D', photo('20260825-130000-b', 'alt.jpg')),
    change('A', photo('20260825-130000-b', 'upload-2-def-neu.jpeg')),
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.locationCount, 2);
});

test('erlaubt das Löschen eines Eintrags', () => {
  const result = evaluateCmsChanges([change('D', entry('20260825-120000-a'))]);
  assert.equal(result.ok, true);
  assert.equal(result.locationCount, 1);
});

test('lehnt ab, wenn kein Eintrag betroffen ist', () => {
  const result = evaluateCmsChanges([
    change('A', photo('20260825-120000-a', 'upload-1-abc-foto.jpg')),
  ]);
  assert.equal(result.ok, false);
});

test('lehnt Foto ohne zugehörigen geänderten Eintrag ab', () => {
  const result = evaluateCmsChanges([
    change('A', entry('20260825-120000-a')),
    change('A', photo('20260825-999999-x', 'upload-1-abc-foto.jpg')),
  ]);
  assert.equal(result.ok, false);
  assert.equal(result.invalid.length, 1);
});

test('lehnt neue Fotos ohne upload-Präfix ab', () => {
  const result = evaluateCmsChanges([
    change('A', entry('20260825-120000-a')),
    change('A', photo('20260825-120000-a', 'handverdrahtet.jpg')),
  ]);
  assert.equal(result.ok, false);
});

test('lehnt Dateien außerhalb der erlaubten Pfade ab', () => {
  const result = evaluateCmsChanges([
    change('A', entry('20260825-120000-a')),
    change('M', 'src/App.js'),
  ]);
  assert.equal(result.ok, false);
});

test('lehnt umbenannte Einträge ab', () => {
  const result = evaluateCmsChanges([
    change('R', entry('20260825-120000-a'), entry('20260825-120000-b')),
  ]);
  assert.equal(result.ok, false);
});
