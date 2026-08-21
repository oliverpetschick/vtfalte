import { spawn, spawnSync } from 'node:child_process';

for (const task of ['generate-content', 'prepare-admin']) {
  const result = spawnSync('npm', ['run', task], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const environment = { ...process.env, BROWSER: 'none', HOST: '127.0.0.1', BIND_HOST: '127.0.0.1' };
const children = [
  spawn('npm', ['run', 'start:app'], { env: environment, stdio: 'inherit' }),
  spawn('npx', ['--no-install', 'decap-server'], { env: environment, stdio: 'inherit' }),
];
let stopping = false;

console.log('\nWebseite: http://localhost:3000');
console.log('Editor:   http://localhost:3000/admin/\n');

const stop = signal => {
  if (stopping) return;
  stopping = true;
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
