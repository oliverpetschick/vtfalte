import { spawn, spawnSync } from 'node:child_process';
import { readFile, rm, rmdir } from 'node:fs/promises';
import path from 'node:path';
import chokidar from 'chokidar';
import { loadLocations } from './content-files.mjs';

for (const task of ['generate-content', 'prepare-admin']) {
  const result = spawnSync('npm', ['run', task], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const environment = { ...process.env, BROWSER: 'none', HOST: '127.0.0.1', BIND_HOST: '127.0.0.1' };
const children = [
  spawn('npm', ['run', 'start:app'], { env: environment, stdio: 'inherit' }),
  spawn('npx', ['--no-install', 'decap-server'], { env: environment, stdio: 'inherit' }),
];
const contentWatcher = chokidar.watch(['src/content/locations', 'src/images/folds'], {
  ignoreInitial: true,
});
let generateTimer;
const locationPhotos = new Map(
  (await loadLocations()).map(({ file, location }) => [
    file,
    new Set((location.photos ?? []).map(photo => photo.src)),
  ]),
);

const generateContent = () => {
  clearTimeout(generateTimer);
  generateTimer = setTimeout(() => {
    const result = spawnSync('npm', ['run', 'generate-content'], { stdio: 'inherit' });
    if (result.status !== 0) console.error('Inhaltsvorschau konnte nicht aktualisiert werden.');
  }, 150);
};

contentWatcher.on('all', async (event, filename) => {
  if (filename.startsWith('src/content/locations/')) {
    const absoluteFilename = path.resolve(filename);
    const id = path.basename(filename, '.json');
    if (event === 'add' || event === 'change') {
      try {
        const location = JSON.parse(await readFile(filename, 'utf8'));
        locationPhotos.set(absoluteFilename, new Set((location.photos ?? []).map(photo => photo.src)));
      } catch (error) {
        console.error(`Standort konnte nicht gelesen werden: ${error.message}`);
      }
    } else if (event === 'unlink' && /^[a-zA-Z0-9-]+$/.test(id)) {
      const removed = locationPhotos.get(absoluteFilename) ?? new Set();
      locationPhotos.delete(absoluteFilename);
      const remaining = new Set([...locationPhotos.values()].flatMap(references => [...references]));
      const expectedFolder = path.resolve('src/images/folds', `fold_${id}`);
      for (const reference of removed) {
        const photo = path.resolve('src', reference);
        if (path.dirname(photo) === expectedFolder && !remaining.has(reference)) {
          await rm(photo, { force: true });
        }
      }
      await rmdir(expectedFolder).catch(error => {
        if (!['ENOENT', 'ENOTEMPTY'].includes(error.code)) throw error;
      });
    }
  }
  generateContent();
});
let stopping = false;

console.log('\nWebseite: http://localhost:3000');
console.log('Editor:   http://localhost:3000/admin/\n');

const stop = signal => {
  if (stopping) return;
  stopping = true;
  clearTimeout(generateTimer);
  contentWatcher.close();
  for (const child of children) child.kill(signal);
};

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stop(signal));
}
for (const child of children) {
  child.on('exit', code => {
    if (!stopping) {
      process.exitCode = code ?? 1;
      stop('SIGTERM');
    }
  });
}
