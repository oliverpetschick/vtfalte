import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const generatedPath = path.join(root, 'src/content/generated');

const walk = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    }),
  );
  return files.flat();
};

const toPosix = value => value.split(path.sep).join('/');
const locations = (await walk(path.join(root, 'src/content/locations')))
  .filter(file => file.endsWith('.json'))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
const images = (await walk(path.join(root, 'src/images')))
  .filter(file => /\.(?:jpe?g|png)$/i.test(file))
  .sort();

const locationImports = locations.map(
  (file, index) => `import location${index} from '../locations/${path.basename(file)}';`,
);
const locationRecords = locations.map(
  (file, index) => `  { filename: './${path.basename(file)}', location: location${index} },`,
);
const imageImports = images.map((file, index) => {
  const relative = toPosix(path.relative(path.join(root, 'src/content/generated'), file));
  return `import image${index} from '${relative.startsWith('.') ? relative : `./${relative}`}';`;
});
const imageRecords = images.map((file, index) => {
  const relative = toPosix(path.relative(path.join(root, 'src'), file));
  return `  '${relative}': image${index},`;
});

await mkdir(generatedPath, { recursive: true });
await writeFile(
  path.join(generatedPath, 'locations.js'),
  `${locationImports.join('\n')}\n\nconst locations = [\n${locationRecords.join('\n')}\n];\n\nexport default locations;\n`,
);
await writeFile(
  path.join(generatedPath, 'images.js'),
  `${imageImports.join('\n')}\n\nconst images = {\n${imageRecords.join('\n')}\n};\n\nexport default images;\n`,
);

console.log(`Generated manifests for ${locations.length} locations and ${images.length} images.`);
