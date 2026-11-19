/** Check that consumers can use the bundled types and emit their own declarations. */
import { mkdtempSync, readFileSync, rmSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const declarations = readFileSync(new URL('../dist/main.d.ts', import.meta.url), 'utf8');

if (declarations.includes('@rotacloud/types')) {
  console.error('dist/main.d.ts still references @rotacloud/types.');
  process.exitCode = 1;
}

const consumerDirectory = mkdtempSync(join(tmpdir(), 'rotacloud-declarations-'));
try {
  mkdirSync(join(consumerDirectory, 'node_modules'));
  symlinkSync(fileURLToPath(new URL('..', import.meta.url)), join(consumerDirectory, 'node_modules/rotacloud'), 'dir');
  writeFileSync(join(consumerDirectory, 'package.json'), JSON.stringify({ type: 'module' }));
  writeFileSync(
    join(consumerDirectory, 'index.ts'),
    `import { createRotaCloudClient } from 'rotacloud';
export const effects = {
  listShifts: (client = createRotaCloudClient({ apiKey: 'test' })) => client.shift.listAll({ start: 0, end: 1 }),
};
`,
  );
  execFileSync(
    process.execPath,
    [
      fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url)),
      join(consumerDirectory, 'index.ts'),
      '--declaration',
      '--emitDeclarationOnly',
      '--strict',
      '--module',
      'NodeNext',
      '--target',
      'ES2022',
      '--outDir',
      join(consumerDirectory, 'dist'),
    ],
    { stdio: 'inherit' },
  );
} finally {
  rmSync(consumerDirectory, { recursive: true, force: true });
}
