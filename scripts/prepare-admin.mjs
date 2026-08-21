import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const adminPath = path.join(root, 'public/admin');
const vendorPath = path.join(adminPath, 'vendor');
const oauthUrl = (process.env.CMS_OAUTH_URL || 'http://localhost:8787').replace(/\/$/, '');

if (process.env.REQUIRE_CMS_OAUTH_URL === '1' && !process.env.CMS_OAUTH_URL) {
  throw new Error('CMS_OAUTH_URL muss für einen Produktions-Deploy gesetzt sein.');
}
if (!/^https:\/\//.test(oauthUrl) && !/^http:\/\/localhost(?::\d+)?$/.test(oauthUrl)) {
  throw new Error('CMS_OAUTH_URL muss HTTPS verwenden.');
}

await mkdir(path.join(vendorPath, 'leaflet/images'), { recursive: true });
await cp(
  path.join(root, 'node_modules/decap-cms/dist/decap-cms.js'),
  path.join(vendorPath, 'decap-cms.js'),
);
await cp(
  path.join(root, 'node_modules/decap-cms/LICENSE'),
  path.join(vendorPath, 'decap-cms.LICENSE'),
);
await cp(
  path.join(root, 'node_modules/leaflet/dist/leaflet.js'),
  path.join(vendorPath, 'leaflet/leaflet.js'),
);
await cp(
  path.join(root, 'node_modules/leaflet/dist/leaflet.css'),
  path.join(vendorPath, 'leaflet/leaflet.css'),
);
await cp(
  path.join(root, 'node_modules/leaflet/dist/images'),
  path.join(vendorPath, 'leaflet/images'),
  { recursive: true },
);
await cp(
  path.join(root, 'node_modules/leaflet/LICENSE'),
  path.join(vendorPath, 'leaflet.LICENSE'),
);

const template = await readFile(path.join(adminPath, 'config.template.yml'), 'utf8');
await writeFile(path.join(adminPath, 'config.yml'), template.replace('__CMS_OAUTH_URL__', oauthUrl));
console.log(`Admin vorbereitet (${oauthUrl}).`);
