import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { legacyPhotoAliases, loadLocations, referencedPhotos, root, walk } from './content-files.mjs';

const allowedKeys = new Set([
  'title',
  'galleryOrder',
  'createdAt',
  'archived',
  'categoryId',
  'coordinates',
  'address',
  'type',
  'usage',
  'formerUsage',
  'condition',
  'photos',
  'links',
]);
const optionalTextKeys = ['address', 'type', 'usage', 'formerUsage', 'condition'];
const errors = [];
const fail = (id, message) => errors.push(`${id}: ${message}`);
const locations = await loadLocations();
const orders = new Map();

for (const { id, location } of locations) {
  for (const key of Object.keys(location)) {
    if (!allowedKeys.has(key)) fail(id, `unbekanntes Feld „${key}“`);
  }
  if (typeof location.title !== 'string' || !location.title.trim()) {
    fail(id, 'interner Titel fehlt');
  }
  if (location.galleryOrder != null) {
    if (!Number.isFinite(location.galleryOrder)) {
      fail(id, 'Galerie-Position muss eine Zahl sein');
    } else if (orders.has(location.galleryOrder)) {
      fail(id, `Galerie-Position ${location.galleryOrder} wird auch von ${orders.get(location.galleryOrder)} verwendet`);
    } else {
      orders.set(location.galleryOrder, id);
    }
  }
  if (typeof location.archived !== 'boolean') fail(id, 'Archivstatus fehlt');
  if (!Number.isInteger(location.categoryId) || location.categoryId < 1 || location.categoryId > 8) {
    fail(id, 'Kategorie muss zwischen 1 und 8 liegen');
  }

  const longitude = location.coordinates?.longitude;
  const latitude = location.coordinates?.latitude;
  if (!Number.isFinite(longitude)) {
    fail(id, 'Längengrad muss eine Zahl sein');
  }
  if (!Number.isFinite(latitude)) {
    fail(id, 'Breitengrad muss eine Zahl sein');
  }
  for (const key of optionalTextKeys) {
    if (location[key] != null && typeof location[key] !== 'string') {
      fail(id, `„${key}“ muss Text sein`);
    }
  }
  if (!Array.isArray(location.photos)) {
    fail(id, 'Fotos müssen eine Liste sein');
  } else {
    for (const [index, photo] of location.photos.entries()) {
      if (typeof photo?.src !== 'string' || !/^images\/(folds|uploads)\/[\w./ ()äöüÄÖÜß-]+\.(jpe?g|png)$/i.test(photo.src)) {
        fail(id, `Foto ${index + 1} hat einen ungültigen Pfad`);
        continue;
      }
      if (typeof photo.credit !== 'string' || !photo.credit.trim()) {
        fail(id, `Foto ${index + 1} benötigt eine Bildquelle`);
      }
      try {
        await access(path.join(root, 'src', photo.src));
      } catch {
        const alias = legacyPhotoAliases.get(photo.src);
        if (alias) {
          console.warn(`${id}: bekannte Altlast bleibt unverändert (${photo.src})`);
        } else {
          fail(id, `Foto fehlt: ${photo.src}`);
        }
      }
    }
  }
  if (!Array.isArray(location.links)) {
    fail(id, 'Links müssen eine Liste sein');
  } else {
    for (const [index, link] of location.links.entries()) {
      try {
        const url = new URL(link?.url);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        fail(id, `Link ${index + 1} benötigt eine vollständige http(s)-Adresse`);
      }
    }
  }
}

const uploadFiles = (await walk(path.join(root, 'src/images/uploads'))).filter(file => /\.(jpe?g|png)$/i.test(file));
for (const file of uploadFiles) {
  const relative = path.relative(path.join(root, 'src'), file).split(path.sep).join('/');
  if (!referencedPhotos(locations).has(file) && process.argv.includes('--strict-media')) {
    fail('Medien', `nicht verwendetes Foto: ${relative}`);
  }
  const metadata = await sharp(file).metadata();
  if (metadata.format !== 'jpeg') fail(relative, 'neue Fotos müssen als JPEG gespeichert sein');
  if ((metadata.width ?? Infinity) > 1920) fail(relative, 'Foto ist breiter als 1920 Pixel');
  if (metadata.hasAlpha) fail(relative, 'Foto darf keine Transparenz enthalten');
  if (metadata.exif || metadata.iptc || metadata.xmp) fail(relative, 'Metadaten wurden nicht entfernt');
}

if (errors.length) {
  console.error(`Inhaltsprüfung fehlgeschlagen:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`${locations.length} Standorte und ${uploadFiles.length} neue Fotos sind gültig.`);
