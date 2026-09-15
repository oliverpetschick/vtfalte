import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'node_modules/maplibre-gl/dist');
const targetPath = path.join(root, 'public/maplibre');

await mkdir(targetPath, { recursive: true });

for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
    await cp(path.join(sourcePath, file), path.join(targetPath, file));
}

console.log('MapLibre worker prepared.');
